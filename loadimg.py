import subprocess
import threading
import sys

class bcolors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

# Replace with your domain
domain = "asherfalcon.com"

# Run the dig command
result = subprocess.run(
    ["dig", "@8.8.8.8", "+short", f"dnsimg-count.{domain}", "TXT"],
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

chunks = []

def printStatus():
    # "\033[F"+
    msg = bcolors.OKBLUE+"["
    for i in chunks:
        if(i==""):
            msg+=bcolors.FAIL+"#"
        else:
            msg+=bcolors.OKGREEN+"#"
    msg+=bcolors.OKBLUE+"]"
    print(msg)



def getChunk(chunkIndex):
    chunk = subprocess.run(
        ["dig", "+short", f"dnsimg-{chunkIndex+1}.{domain}", "TXT"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    if(chunk.stdout!=""):
        chunkData = chunk.stdout.replace(" ","").replace("\"","").replace("\n","")
        chunks[chunkIndex] = chunkData
    else:
        print(f"Err {chunkIndex} {chunk.stderr} '{chunk.stdout}'")
        # printStatus()
        # print(f"Added chunk #{chunkIndex+1} ({len(chunkData)} chars)")

if(result.stdout == ""):
    print("No dnsimg found")
else:
    size = int(result.stdout[1:-2])
    print(f"Found dnsimg with {size} chunks")
    
    chunks = [""]*size

    threads = []

    for chunkIndex in range(size):
        threads.append(threading.Thread(target=getChunk, args=(chunkIndex,)))

    for t in threads:
        t.start()

    for t in threads:
        t.join()
        printStatus()

    printStatus()
    with open("dnsimg.jpg", "wb") as output:
        output.write(bytes.fromhex("".join(chunks)))