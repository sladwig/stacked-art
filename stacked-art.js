const stackedArtCssStyle = `
.stacked-art {
  position: relative;
  display: grid;
  background: black;
  cursor: pointer;
  overflow: hidden;
  width: 100%;
  height: 100%;
}
.art, .overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.overlay {
  font-size: 64px;
  color: white;
  font-weight: 900;
  letter-spacing: 16px;
  display: grid;
  place-items: center;
  transition: opacity 300ms ease;
  text-shadow: 1px 1px 12px black;
}`

class StackedArt extends HTMLElement {
  constructor() {
    super();
    this.playing = false;
    this.blendMode = "screen";
    this.possibleBlendModes = [
       "color"
      ,"color-burn"
      ,"color-dodge"
      ,"darken"
      ,"difference"
      ,"exclusion"
      ,"hard-light"
      ,"hue"
      ,"lighten"
      ,"luminosity"
      ,"multiply"
      ,"normal"
      ,"overlay"
      ,"saturation"
      ,"screen"
      ,"soft-light"
    ]
  }
  setBlendMode(newBlendMode) {
    if (this.possibleBlendModes.includes(newBlendMode)) {
      this.blendMode = newBlendMode
    }
  }

  connectedCallback() {
    this.attachShadow({mode: 'open'});
    this.shadowRoot.innerHTML = this.render();

    this.setBlendMode(this.getAttribute('blend-mode'))

    setTimeout(() => {
      this.$overlay = this.shadowRoot.querySelector('.overlay')
      this.$media = this.querySelectorAll('video, audio')
      this.$art = this.querySelectorAll('img, video')

      this.$overlay.textContent = this.getAttribute('title')

      this.$art.forEach((art, i) => {
        art.style.width = "100%"
        art.style.height = "100%"
        art.style.objectFit = "cover"
        art.style.position = "absolute"
        art.style.top = "0"
        art.style.left = "0"
        art.style.objectFit = "stretch"
        if (i) {
          art.style.mixBlendMode = this.blendMode;
        }
      })
    }, 0);

    this.addEventListener('click', this.playPause)
  }

  playPause() {
    this.$media.forEach(media => {
      if (this.playing) {
        media.pause()
      } else {
        media.play().catch(() => {
          console.log('error with playback')
          media.style.display = "none";
        })
      }
    })
    this.playing = !this.playing;
    this.$overlay.style.opacity = this.playing ? 0 : 1;
  }

  render() {
    return `<style>${stackedArtCssStyle}</style>
  <div class="stacked-art">
    <div class="art"><slot></slot></div>
    <div class="overlay"></div>
  </div>`
  }
}
customElements.define('stacked-art', StackedArt);
