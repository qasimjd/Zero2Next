import { createClient } from "@sanity/client";

import { apiVersion, dataset, projectId, token } from '../env'


// Define the write client configuration
export const writeClient = createClient({
  projectId,
  dataset,
  token,
  useCdn: false, 
  apiVersion,
});

if(!writeClient.config().token) {
  console.error('No token found in env')
}