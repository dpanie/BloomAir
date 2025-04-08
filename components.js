class SiteHeader extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <header>
        <div class="buttons">
          <a href="index.html">Home</a>
          <a href="contact.html">Contact</a>
          <a href="why_bloomair.html">About BloomAir</a>
          <a href="native_insects.html">Native Insects</a>
          <a href="native_plants.html">Native Plants</a>
          <a href="real_time_data.html">Real Time Data</a>
          <a href="what_to_do.html">Join the Buzz</a>
        </div>
        </header>
      `;
    }
  }
  customElements.define('site-header', SiteHeader);
  