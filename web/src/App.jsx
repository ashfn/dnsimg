import * as React from 'react';
import { useDnsImgStore } from './dnsImgStore';

function App() {
  const { domain, setDomain, fetchChunks, imageBase64, chunksDone, chunkCount } = useDnsImgStore();
  const [input, setInput] = React.useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleFetch = () => {
    setDomain(input);
    fetchChunks();
  };


  return (
    <div className="bg-gray-400">
      <span className="text-2xl text-[#ffffff]">DnsImg</span>
      <div className="flex flex-col items-center justify-center">
        <input type="text" placeholder="Enter a domain" value={input} onChange={handleInputChange} className="text-black" />
        <button onClick={handleFetch}>Fetch</button>
      </div>  
      <div className="flex flex-col items-center justify-center">
        {imageBase64 && <img src={`data:image/png;base64,${imageBase64}`} alt="DnsImg" />}
        <span>Chunks done: {chunksDone} / {chunkCount}</span>
      </div>
    </div>
  )
}

export default App
