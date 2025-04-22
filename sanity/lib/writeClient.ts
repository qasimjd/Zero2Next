import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId, token } from '../env'


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