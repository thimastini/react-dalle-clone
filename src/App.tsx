import { useState } from 'react'
import Modal from './components/Modal'

const App = () => {
  const [error, setError] = useState('')
  const [value, setValue] = useState('')
  const [images, setImages] = useState<any[]>([])
  const [selectedImage, setSelectedImage] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const surpriseOptions: string[] = [
    'Spongebob hunting jellyfishes',
    'A blue ostrich eating melon',
    'A matisse style shark on the telephone',
    'A pineapple sunbathing on an island'
  ]

  const surpriseMe = () => {
    setImages([])
    const randomOption = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
    setValue(randomOption)
  }

  const getImages = async () => {
    if (value === '') {
      setError('Please enter a prompt')
      return
    }

    setImages([])

    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          prompt: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch('http://localhost:8000/api/v1/images', options)
      const data = await response.json()
      setImages(data)
    } catch (error) {
      console.error(error)
    }
  }

  const uploadImage = async (e: any) => {
    const formData = new FormData()
    formData.append('file', e.target.files[0])
    setModalOpen(true)
    setSelectedImage(e.target.files[0])
    e.target.value = null

    try {
      const options = {
        method: 'POST',
        body: formData
      }
      await fetch('http://localhost:8000/api/v1/images/upload', options)
    } catch (error) {
      console.error(error)
    }
  }

  const generateVariations = async () => {
    setImages([])

    if (selectedImage === null) {
      setError('Please upload an image')
      setModalOpen(false)
      return
    }

    try {
      const options = {
        method: 'POST'
      }
      const response = await fetch('http://localhost:8000/api/v1/images/variations', options)
      const data = await response.json()
      setImages(data)
      setModalOpen(false)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="app">
      <section className="search-section">
        <p>Start with a detailed description <span className="surprise" onClick={surpriseMe}>Surprise me</span></p>
        <div className="input-container">
          <input value={value} placeholder="Spongebob hunting jellyfishes, pixel art..." onChange={e => setValue(e.target.value)} />
          <button onClick={getImages}>Generate</button>
        </div>
        <p className="extra-info">Or,
          <span>
            <label htmlFor="image-file"> upload an image </label>
            <input type="file" id="image-file" accept="image/*" hidden onChange={uploadImage} />
          </span>
          to edit.
        </p>
        {error && <p>{error}</p>}
        {modalOpen && <div className="overlay">
          <Modal
            setModalOpen={setModalOpen}
            setSelectedImage={setSelectedImage}
            selectedImage={selectedImage}
            generateVariations={generateVariations} />
        </div>}
      </section>
      <section className="image-section">
        {images.map((image, index) => (
          <img key={index} src={image.url} alt={'Generated image of ' + value} />
        ))}
      </section>
    </div>
  )
}

export default App
