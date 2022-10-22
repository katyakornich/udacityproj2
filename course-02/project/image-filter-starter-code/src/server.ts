import express from 'express';
import bodyParser from 'body-parser';
import { IndexRouter } from './controllers/v0/index.router';
import {filterImageFromURL, deleteLocalFiles} from './util/util';


(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //app.use('/api/controllers/', IndexRouter)

app.get( "/filteredimage", async ( req, res ) => {
  //res.send("TODO endpoint: filteredimage?image_url={{}}")
  if (req.query.image_url) // parameter name validation
    {
        if (isValidUrl(req.query.image_url)) // parameter value validation
        {
            try
            {
                var localFilteredImagePath = await filterImageFromURL(req.query.image_url);
                res.status(200).sendFile(await filterImageFromURL(localFilteredImagePath));
                const arrDeleteFiles: string[] = [localFilteredImagePath];
                deleteLocalFiles(arrDeleteFiles);
            }
            catch (error)
            {
                res.status(415).send(error + "<p>Try this image instead: ?image_url=https://www.w3schools.com/whatis/img_http.jpg</p>");
            }
        }
        else
        {   
            res.status(400).send("Invalid parameter value");
        }
    }
    else
    {
        res.status(400).send("Invalid parameter name. Use ?image_url=");
    }
} );

// credit https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/
const isValidUrl = (urlString: string)=> {
  var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
'((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
'(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
'(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
return !!urlPattern.test(urlString);
}

app.use('/api/v0/', IndexRouter)
//app.use('/controllers/v0/', IndexRouter)
  //! END @TODO1
  

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}} updated")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();