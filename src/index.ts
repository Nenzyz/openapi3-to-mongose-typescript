import args from 'args';

args
    .option(['i','input','input-folder','input-folder-yaml'], 'Folder when are the yaml open3 api description','./api')
    .option(['o','output','output-folder','output-folder-models'], 'Folder when write the mogoose models. the program backup older versions for default','./models')
    .option(['n','no-backup'], 'Don\'t backup older versions of moongose models')
    .option(['h','?','help'], 'Show this help',false);


const config = args.parse(process.argv);

if(config.help) {
    args.showHelp()
}
