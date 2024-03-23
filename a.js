const mongoose=require('mongoose')
const fs=require('fs')
const pdfSchema=new mongoose.Schema({
    name:String,data:Buffer
})

const Pdf=mongoose.model('Pdf',pdfSchema)

mongoose.connect('mongodb+srv://technoidkolkata:technoid123@cluster0.iivynkd.mongodb.net/pdf_files',{
    useNewUrlParser:true,useUnifiedTopology:true
})

async function storePdf(path){
    try{
        const pdfBuffer=fs.readFileSync(path)
        const pdf=new Pdf({
            name:path,data:pdfBuffer
        })
        await Pdf.insertMany([pdf]);
        console.log("PDF File Stored");
    }
    catch(error){
        console.error("Unsuccesfull",error);
    }
}
storePdf('test.pdf')
