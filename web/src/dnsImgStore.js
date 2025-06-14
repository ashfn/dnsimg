import { create } from 'zustand';

const GOOGLE_DNS_API = 'https://dns.google/resolve';

function hexToBase64(hexString) {
  const bytes = [];
  for (let i = 0; i < hexString.length; i += 2) {
    bytes.push(parseInt(hexString.substr(i, 2), 16));
  }
  
  const binaryString = String.fromCharCode(...bytes);
  
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
  setDomain: (domain) => set({ domain }),
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
  fetchChunks: async () => {
    const { domain } = get();
    if (!domain) {
      set({ error: 'No domain set', chunkCount: null, chunks: [] });
      return;
    }
    set({ loading: true, error: null, chunkCount: null, chunks: [], imageBase64: null, chunksDone: 0 });
    try {
      const countRes = await fetch(`${GOOGLE_DNS_API}?name=dnsimg-count.${domain}&type=TXT`);
      const countJson = await countRes.json();
      const countTxt = countJson?.Answer?.[0]?.data?.replace(/"/g, '');
      const chunkCount = parseInt(countTxt, 10);
      if (isNaN(chunkCount)) throw new Error('Invalid chunk count');
      set({ chunkCount });

      const chunkPromises = Array.from({ length: chunkCount }, (_, i) =>
        fetch(`${GOOGLE_DNS_API}?name=dnsimg-${i+1}.${domain}&type=TXT`)
          .then(res => res.json())
          .then(json => json?.Answer?.[0]?.data?.replace(/"/g, '') || '')
          .catch(error => {
            console.log('error', error);
            return '';
          })
      );
      const chunks = await Promise.all(chunkPromises);
      set({ chunks, chunksDone: chunkCount });

      const hexImg = chunks.join('');
      const imageBase64 = hexToBase64(hexImg);
      set({ imageBase64, loading: false });
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