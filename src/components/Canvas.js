import { useRef, useEffect } from 'react'

const Canvas = props => {

    const canvasRef = useRef(null)


    useEffect(() => {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        ctx.beginPath();
        ctx.arc(250, 250, 100, 0, 2 * Math.PI);
        ctx.stroke(); 
      
    }, [])


    return <canvas ref={canvasRef} {...props} />
}
export default Canvas
