import type {Link as FetchLink} from '@opensdks/fetch-links'
import {mergeHeaders, modifyRequest} from '@opensdks/fetch-links'

interface OpenIntProxyHeaders {
  authorization?: `Bearer ${string}`
  'x-apikey'?: string
  'x-resource-id': string
}

// TODO: Test that I'm actally working!
export function openIntProxyLink(opts: {
  apiKey: string
  resourceId: string
  baseUrl?: string
}): FetchLink {
  const headers = {
    ['x-apikey']: opts.apiKey,
    ['x-resource-id']: opts.resourceId,
  } satisfies OpenIntProxyHeaders

  return async (req, next) => {
    const baseUrl = opts.baseUrl ?? getBaseUrl(req.url)
    const res = await next(
      modifyRequest(req, {
        url:
          'https://staging.openint.dev/api/proxy/' +
          req.url.replace(baseUrl, '').replace(/^\/+/, ''),
        headers: mergeHeaders(req.headers, headers, {}),
        body: req.body,
      }),
    )
    return res
  }
}

function getBaseUrl(urlStr: string) {
  const url = new URL(urlStr)
  return `${url.protocol}//${url.host}/`
}
