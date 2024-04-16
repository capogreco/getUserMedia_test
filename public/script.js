document.body.style.margin   = 0
document.body.style.overflow = `hidden`

const stream = await navigator.mediaDevices.getUserMedia ({ 
   audio: false,
   video: true,
   facingMode: `user`,
})

const videoTracks = await stream.getVideoTracks ()
console.log (`Using video device: ${ videoTracks[0].label }`)

const video = document.createElement (`video`)
video.srcObject = stream
await video.play ()

const cnv = document.createElement (`canvas`)
cnv.width  = 64
cnv.height = cnv.width * video.videoHeight / video.videoWidth

const div = document.createElement (`div`)
div.style.fontFamily = `monospace`
document.body.appendChild (div)

const ctx = cnv.getContext (`2d`)

const density = "Ñ@#W$9876543210?!abc;:+=-,._                 "
const density_len = density.length

const draw_frame = async () => {
   ctx.drawImage (video, 0, 0, cnv.width, cnv.height)
   const pixels = await ctx.getImageData (0, 0, cnv.width, cnv.height).data

   let ascii_img = ``

   for (let y = 0; y < cnv.height; y += 2) {
      for (let x = 0; x < cnv.width; x++) {
         const i = (y * cnv.width + x) * 4
         const r = pixels[i]
         const g = pixels[i + 1]
         const b = pixels[i + 2]
         const br = r * g * b / 16581375
         const char_i = Math.floor (br * density_len)
         ascii_img += density[char_i]
      }
      ascii_img += `\n`
   }
   div.innerText = ascii_img

   requestAnimationFrame (draw_frame)
}

draw_frame ()

