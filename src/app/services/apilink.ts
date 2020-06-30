import { BaseRequestOptions, Headers, RequestOptions, RequestOptionsArgs } from '@angular/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomRequestOptions extends BaseRequestOptions {
  merge(options?: RequestOptionsArgs): RequestOptions {
    return new CommonRequestOptions(super.merge(extracted(options)));
  }
}

/**
 * for inner merge when using post put patch delete...others method
 */
export class CommonRequestOptions extends RequestOptions {
  merge(options?: RequestOptionsArgs): RequestOptions {
    return new RequestOptions(super.merge(extracted(options)));
  }
}

/**
 * inject default values
 *
 * @param options
 * @returns {RequestOptionsArgs}
 */
export function extracted(options: RequestOptionsArgs) {
  if (!validUrl(options.url)) {
    options.url = 'http://54.162.48.204:3000/' + (options.url ? options.url : ""); //13.59.189.135
    //localStorage.setItem('APIURL','http://13.59.189.135:3002');
  }
  

  return options;
}

/**
 * validate url
 *
 * @param url
 * @returns {boolean}
 */
export function validUrl(url: string) {
  return /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(url);
}