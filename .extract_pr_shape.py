import struct
import zipfile

with zipfile.ZipFile("pr_states.zip") as z:
    dbf = z.read("cb_2024_us_state_5m.dbf")
    shp = z.read("cb_2024_us_state_5m.shp")

header_len = struct.unpack_from("<H", dbf, 8)[0]
record_len = struct.unpack_from("<H", dbf, 10)[0]
fields = []
offset = 32
while dbf[offset] != 0x0D:
    name = dbf[offset:offset + 11].split(b"\0", 1)[0].decode("ascii")
    length = dbf[offset + 16]
    fields.append((name, length))
    offset += 32
records = []
for i in range(struct.unpack_from("<I", dbf, 4)[0]):
    row = dbf[header_len + i * record_len:header_len + (i + 1) * record_len]
    at = 1
    values = {}
    for name, length in fields:
        values[name] = row[at:at + length].decode("ascii", "ignore").strip()
        at += length
    records.append(values)
print(fields)
print([(i, r) for i, r in enumerate(records) if r.get("STUSPS") == "PR"])

at = 100
shapes = []
while at < len(shp):
    content_len = struct.unpack_from(">I", shp, at + 4)[0] * 2
    d = at + 8
    shape_type = struct.unpack_from("<I", shp, d)[0]
    if shape_type == 5:
        num_parts, num_points = struct.unpack_from("<II", shp, d + 36)
        part_at = d + 44
        parts = list(struct.unpack_from("<" + "I" * num_parts, shp, part_at))
        point_at = part_at + num_parts * 4
        points = [struct.unpack_from("<dd", shp, point_at + i * 16) for i in range(num_points)]
        rings = []
        for j, start in enumerate(parts):
            end = parts[j + 1] if j + 1 < len(parts) else num_points
            rings.append(points[start:end])
        shapes.append(rings)
    else:
        shapes.append([])
    at += 8 + content_len

pr_index = next(i for i, row in enumerate(records) if row.get("STUSPS") == "PR")
rings = shapes[pr_index]
def area(ring):
    return abs(sum(ring[i][0] * ring[(i + 1) % len(ring)][1] - ring[(i + 1) % len(ring)][0] * ring[i][1] for i in range(len(ring))) / 2)
for ring in sorted(rings, key=area, reverse=True)[:10]:
    print(len(ring), area(ring), (min(p[0] for p in ring), min(p[1] for p in ring), max(p[0] for p in ring), max(p[1] for p in ring)))
