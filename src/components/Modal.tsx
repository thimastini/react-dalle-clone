import { useState, useRef } from 'react'

const Modal = ({ setModalOpen, setSelectedImage, selectedImage, generateVariations }: any) => {
    const [error, setError] = useState('')
    const ref = useRef<HTMLImageElement>(null)

    const closeModal = () => {
        setModalOpen(false)
        setSelectedImage()
    }

    const checkSize = () => {
        if (ref?.current?.width == 256 && ref.current.height == 256) {
            generateVariations()
        } else {
            setError('Error: Image must be 256x256')
        }
    }

    return (
        <div className="modal">
            <div onClick={closeModal}>✖</div>
            <div className="img-container">
                {selectedImage && <img ref={ref} src={URL.createObjectURL(selectedImage)} alt="Uploaded image" />}
            </div>
            <p>{error || '* Image must be 256x256'}</p>
            {!error && <button onClick={checkSize}>Generate</button>}
            {error && <button onClick={closeModal}>Close and try again</button>}
        </div>
    )
}

export default Modal