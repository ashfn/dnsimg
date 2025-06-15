import * as React from 'react';
import { useDnsImgStore } from './dnsImgStore';

function App() {
  const { domain, setDomain, fetchChunks, imageBase64, chunksDone, chunkCount, loading, error } = useDnsImgStore();
  const [input, setInput] = React.useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleFetch = () => {
    setDomain(input);
    fetchChunks();
  };


  return (
    <div className="bg-primary h-screen flex flex-col items-center justify-center text-secondary font-rubik">
      <span className="text-2xl text-[#ffffff] font-bold font-rubik">dnsimg</span>
      <div className="flex flex-row gap-2 items-center justify-center mb-4 mt-4">
        <input className="border-2 border-secondary rounded-md p-2" type="text" placeholder="Enter a domain" value={input} onChange={handleInputChange} />
        <button className="border-2 border-secondary rounded-md p-2 bg-secondary text-primary cursor-pointer" onClick={handleFetch}>Fetch</button>
      </div>  
      {error && (
        <div className="flex flex-row gap-2 items-center justify-center mb-4 mt-4">
          <span className="text-md text-red-500 font-bold font-rubik">Error: {error}</span>
        </div>
      )}
      <div className="flex flex-col items-center justify-center">
        {imageBase64 && <img src={`data:image/png;base64,${imageBase64}`} alt="DnsImg" />}
        {loading && (
          <div>
          <div className="flex flex-col items-center justify-center">
            <span>Chunks done: {chunksDone} / {chunkCount}</span>
          </div>
          <div className="flex gap-1 mt-2">
            {Array.from({length: chunkCount}).map((_, i) => (
              <div 
                key={i}
                className={`w-2 h-8 rounded ${i < chunksDone ? 'bg-green-500' : 'bg-red-500'}`}
              />
            ))}
            </div>
          </div>
        )}
        
        

        
      </div>
    </div>
  )
}

export default App
