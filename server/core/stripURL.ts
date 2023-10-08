export function stripPath(path: string) {
    return path.split("/").filter(item => item.length > 0);
}

export function stripQuery(query: string) {
    let queryArray = query.split("&");
    let queryObject: Record<string, unknown> = {};
    
    if (queryArray && queryArray.length >= 1) {
        queryArray[0] = queryArray[0].split("?")[1];

        queryArray.forEach((item) => {
            let [key, value] = item.split("=");
            queryObject[key] = parseQueryParamValue(value);
        })
    }
    
    return queryObject;
}

function parseQueryParamValue(value: string): any {
    const parsedNumber = parseFloat(value);
    if (!isNaN(parsedNumber)) {
      return parsedNumber;
    }
  
    if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
      return value.toLowerCase() === 'true';
    }
  
    return value;
  }