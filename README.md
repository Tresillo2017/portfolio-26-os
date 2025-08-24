# os.tomasps.com

This is one of two repositories created for my portfolio website <a href="https://tomasps.com/"><samp>tomasps.com</samp></a>. If you are looking for the main repository you can find it <a href="https://github.com/tresillo2017/portfolio-26"><samp>here</samp></a>! Thanks for taking the time to check this out. If you have any questions of comments, feel free to shoot me an email at <samp><a href="mailto:contact@tomasps.com">contact@tomasps.com</a></samp> or you can DM me on twitter <a href="https://twitter.com/toomas_ps"><samp>@toomas_ps</samp></a>.

<br>

To setup a dev environment:

```bash
# Clone the repository

# Install dependencies 
npm i

# Run the local dev server
npm run dev
```

To serve a production build:

```bash
# Install dependencies if not already done - 'npi i'

# Build for production
npm run build

# Serve the build using express
npm start
```

## Gallery App (Flickr Integration)

The desktop now includes a Photo Gallery application that loads images from the public Flickr feed.

Optional environment configuration (create a `.env` file at project root):

```
REACT_APP_FLICKR_USER_ID=12345678@N00
```

If `REACT_APP_FLICKR_USER_ID` is provided, the Gallery will display that user's public photos. If omitted, it will fall back to a generic public feed (tagged `portfolio`). No API key is required for the public feed endpoint.

After setting the value, restart the dev server (`npm run dev`) so Create React App picks up the new env variable.

