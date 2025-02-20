/* This file is auto-generated by SST. Do not edit. */
/* tslint:disable */
/* eslint-disable */
/* deno-fmt-ignore-file */

declare module "sst" {
  export interface Resource {
    "AUTH_DISCORD_ID": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "AUTH_DISCORD_SECRET": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "AUTH_SECRET": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "DATABASE_URL": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "MyWeb": {
      "type": "sst.aws.Nextjs"
      "url": string
    }
    "NEXTAUTH_URL": {
      "type": "sst.sst.Secret"
      "value": string
    }
    "NEXT_PUBLIC_URL": {
      "type": "sst.sst.Secret"
      "value": string
    }
  }
}
/// <reference path="sst-env.d.ts" />

import "sst"
export {}