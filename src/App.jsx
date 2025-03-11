import { useState } from 'react'
import axios from 'axios'

function App() {
  const [file, setFile] = useState(null)
  const [fileUrl, setFileUrl] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!file) {
      alert('Please select a file first!')
      return
    }
    
    console.log(file);

    try {
      setUploading(true)
      
      // Create form data
      const formData = new FormData()
      formData.append('file', file)

      // Make request to Pinata API
      const responseData = await axios({
        method: "post",
        url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
          pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_API_KEY,
        }
      })
      
      const url = `https://gateway.pinata.cloud/ipfs/${responseData.data.IpfsHash}`
      setFileUrl(url)
      setUploading(false)
      
      console.log('File uploaded:', url)
    } catch (error) {
      console.error('Error uploading file:', error)
      setUploading(false)
      alert('Error uploading file: ' + error.message)
    }
  }

  return (
    <>
      <h1>IPFS Tutorial</h1>
      <input type="file" onChange={handleFileChange} />
      <button 
        type="button" 
        onClick={handleSubmit}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {fileUrl && (
        <div>
          <p>File uploaded successfully!</p>
          <a href={fileUrl} target="_blank" rel="noreferrer">
            View File
          </a>
        </div>
      )}
    </>
  )
}

export default App
