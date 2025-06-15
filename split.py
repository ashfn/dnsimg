image = open("output.txt", "r").read()
image = image.replace("\n", "")
chunks = []

total = int(len(image)/2048)+1

for i in range(total):
    chunk = image[i*2048:(i+1)*2048]
    print(f"Chunk #{i+1}, size: {len(chunk)}")
    chunks.append(chunk)

domain = "asherfalcon.com"

with open(f"{domain}.txt", "a") as dns:
    for chunkIndex in range(len(chunks)):
        dns.write(f"dnsimg-{chunkIndex+1}.{domain}.	60	IN	TXT	\"{chunks[chunkIndex]}\"\n")
    dns.write(f"dnsimg-count.{domain}.	60	IN	TXT	\"{len(chunks)}\"\n")