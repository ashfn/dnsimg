import { create } from 'zustand';

const GOOGLE_DNS_API = 'https://dns.google/resolve?name=';


function hexToBase64(hexString) {
  const bytes = [];
  for (let i = 0; i < hexString.length; i += 2) {
    bytes.push(parseInt(hexString.substr(i, 2), 16));
  }
  let binaryString = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binaryString += String.fromCharCode.apply(null, bytes.slice(i, i + 0x8000));
  }
  return btoa(binaryString);
}

function downloadBase64Image(base64, filename = 'image.png') {
  const link = document.createElement('a');
  link.href = `data:image/png;base64,${base64}`;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const useDnsImgStore = create((set, get) => ({
  domain: '',
  loading: false,
  error: null,
  chunkCount: null,
  chunks: [],
  imageBase64: null,
  chunksDone: 0,
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
  setChunkCount: (chunkCount) => set({ chunkCount }),
  setChunks: (chunks) => set({ chunks }),
  setImageBase64: (imageBase64) => set({ imageBase64 }),
  setChunksDone: (chunksDone) => set({ chunksDone }),
  setDomain: (domain) => set({ domain }),
  fetchChunks: async () => {
    const { domain } = get();
    if (!domain) {
      set({ error: 'No domain set', chunkCount: null, chunks: [] });
      return;
    }
    set({ loading: true, error: null, chunkCount: null, chunks: null, imageBase64: null, chunksDone: 0 });
    try {
      const countRes = await fetch(`${GOOGLE_DNS_API}dnsimg-count.${domain}&type=TXT`);
      const countJson = await countRes.json();
      const countTxt = countJson?.Answer?.[0]?.data?.replace(/"/g, '');
      const chunkCount = parseInt(countTxt, 10);
      if (isNaN(chunkCount)) throw new Error('Invalid chunk count');
      set({ chunkCount, chunks: Array(chunkCount).fill(null) });
      // Start async fetches for each chunk
      for (let i = 0; i < chunkCount; i++) {
        fetch(`${GOOGLE_DNS_API}dnsimg-${i+1}.${domain}&type=TXT`)
          .then(res => res.json())
          .then(json => {
            const chunkData = json?.Answer?.[0]?.data?.replace(/"/g, '') || '';
            const chunks = [...get().chunks];
            chunks[i] = chunkData;
            set({ 
              chunks,
              chunksDone: get().chunksDone + 1
            });
            
            // If all chunks are done, create final image
            if (get().chunksDone === chunkCount) {
              const hexImg = chunks.join('');
              const imageBase64 = hexToBase64(hexImg);
              set({ imageBase64, loading: false });
            }
          })
          .catch(error => {
            console.error('Error fetching chunk', i, error);
            const chunks = [...get().chunks];
            chunks[i] = '';
            set({ 
              chunks,
              chunksDone: get().chunksDone + 1
            });
          });
      }
      
      
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
  downloadImage: () => {
    const { imageBase64 } = get();
    if (imageBase64) {
      downloadBase64Image(imageBase64);
    }
  },
})); 