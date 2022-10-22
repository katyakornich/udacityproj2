import { Router, Request, Response } from 'express';
import {filterImageFromURL, deleteLocalFiles} from '../../../../util/util';

const router: Router = Router();

router.get('/', async (req: Request, res: Response) => {
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
            //var localFilteredImagePath = await filterImageFromURL(req.query.image_url);
            //res.sendFile(await filterImageFromURL(localFilteredImagePath));
            //deleteLocalFiles(new string[] = localFilteredImagePath);
        }
        else
        {   
            res.status(400).send("Invalid parameter value");
        }
    }
    else
    {
        res.status(400).send("Invalid parameter name");
    }
    //var local_img = await filterImageFromURL(req.query.image_url);
   //res.send("Processed file is here: " + local_img);
   //res.sendFile(await filterImageFromURL(req.query.image_url));
});

const isValidUrl = (urlString: string)=> {
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
return !!urlPattern.test(urlString);
}

/*
// Get all feed items
router.get('/', async (req: Request, res: Response) => {
    const items = await FeedItem.findAndCountAll({order: [['id', 'DESC']]});
    items.rows.map((item) => {
            if(item.url) {
                item.url = AWS.getGetSignedUrl(item.url);
            }
    });
    res.send(items);
});

//@TODO
//Add an endpoint to GET a specific resource by Primary Key

// update a specific resource
router.patch('/:id', 
    requireAuth, 
    async (req: Request, res: Response) => {
        //@TODO try it yourself
        res.status(500).send("not implemented")
});


// Get a signed url to put a new item in the bucket
router.get('/signed-url/:fileName', 
    requireAuth, 
    async (req: Request, res: Response) => {
    let { fileName } = req.params;
    const url = AWS.getPutSignedUrl(fileName);
    res.status(201).send({url: url});
});

// Post meta data and the filename after a file is uploaded 
// NOTE the file name is they key name in the s3 bucket.
// body : {caption: string, fileName: string};
router.post('/', 
    requireAuth, 
    async (req: Request, res: Response) => {
    const caption = req.body.caption;
    const fileName = req.body.url;

    // check Caption is valid
    if (!caption) {
        return res.status(400).send({ message: 'Caption is required or malformed' });
    }

    // check Filename is valid
    if (!fileName) {
        return res.status(400).send({ message: 'File url is required' });
    }

    const item = await new FeedItem({
            caption: caption,
            url: fileName
    });

    const saved_item = await item.save();

    saved_item.url = AWS.getGetSignedUrl(saved_item.url);
    res.status(201).send(saved_item);
});
*/

export const FilteredImageRouter: Router = router;