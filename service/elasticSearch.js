const es = require('elasticsearch');
require('dotenv').config()
let logger=require('../logger/logger')
// connect to and interact with Elasticsearch cluster
const esClient = new es.Client({
    host: 'http://localhost:9200',
    log: 'error'
    
});
class ElasticSearch{    
/**
 * @description:create an index on cluster to store json document .
 *  
 */
    initIndex(){
            return esClient.indices.create({
                index: 'notes'
            });
    }
/**
 * @description:delete an index on cluster which is already exist
 *  
 */
    deleteIndex(){
            return esClient.indices.delete({
                index: 'notes'
            });
    }
/**
 * @description:to check that the given name of index is already exist or not
 *  
 */
    indexExists() {  
        return esClient.indices.exists({
            index: 'notes'
        });
    }
/**
 * @description:method for adding json documnet in already existing  index
 *  
 */
addDocument(document) {  
        return esClient.index({
            index: 'fundoo',
            type: "document",
            body: {
                title: document.title,
                description:document.description,
                label:[document.label],
                content: document.content,
                suggest: {
                    input: document.title.split(" "),
                    output: document.title,
                }
            }
        });
    }
/**
 * @description:update the document which is stored in index
 *  
 */
    updateDocument(documentDetails){
        return esClient.update(documentDetails)
    }
/**
 * @description:delete documnet which is stored in index 
 *  
 */
    deleteDocument(documentDetails){
        return esClient.delete(documentDetails)
    }
/**
 * @description:search the whole document based on searching value
 *  
 */
searchDocument(data){
        try{
        return esClient.search({
        index: 'notes',
        type: 'document',
        body: {
          query: {
            multi_match: {
              query: data,
              fields: ['title', 'description']
            }
          }
        }
      });
    } catch(err){
    logger.info(err)
    }
}
}
module.exports=new ElasticSearch()


