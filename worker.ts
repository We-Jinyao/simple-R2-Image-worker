const config = {
  VALID_TOKEN: "123", 
  DOMAIN: "example.com",
}
BUCKET = R2


addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);
  const key = url.pathname.slice(1);

  switch (request.method) {
    case "GET":
      const object = await BUCKET.get(decodeURI(key); 

      if (!object) {
        return new Response("Object Not Found", { status: 404 });
      }

      return new Response(object.body);
    case "POST":
      if (key != "upload" || url.searchParams.get('token') != config.VALID_TOKEN) {
        console.log("Error param!")
        return new Response("Permission denied!", { status: 403 });
      }
      
	    let fileslug = url.searchParams.get('filename');
	    if(!fileslug){
		    fileslug = crypto.randomUUID();
	    }
	    const date = new Date();
	    const month = String(date.getMonth() + 1).padStart(2, '0');
	    const folder = `${date.getFullYear()}/${month}`;
	    const filename = `${folder}/${fileslug}`;

	    const contentType = request.headers.get('content-type');
	    const contentLength = request.headers.get('content-length');
	    if(!contentLength || !contentType){
		    return new Response(JSON.stringify({
			    success: false,
			    message: "content-length and content-type are required",
		    }), {
			  status: 400,
			  headers: {
				  "content-type": "application/json",
			  },
		    });
    	}

	    // write to R2
	    try{
		    await BUCKET.put(filename, request.body, {
			    httpMetadata: {
				  contentType: contentType,
				  cacheControl: 'public, max-age=604800',
			    },
		    });
	    }catch(error){
		    return new Response(JSON.stringify({
			    success: false,
			    message: "Error occured writing to R2",
			    error: {
				    name: error.name,
				    message: error.message,
			    },
		    }), {
			    status: 500,
			    headers: {
				  "content-type": "application/json",
			    },
		    });
	    }


	    const returnUrl = new URL(request.url);
	    returnUrl.searchParams.delete('filename');
      	    returnUrl.searchParams.delete('token');

	    returnUrl.host = config.DOMAIN;
	    returnUrl.pathname = filename;


	    return new Response('{"success": true, "image": "https://'+returnUrl.host+returnUrl.pathname+'"}' , {
		    headers: {
			  "content-type": "application/json",
		    },
	    });
    default:
      return new Response("Route Not Found.", { status: 404 });
  }
}
