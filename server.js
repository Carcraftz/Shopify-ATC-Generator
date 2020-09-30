//user configurable items
let prefix = "!";
let token = "redacted";

//imports
const fetch = require("node-fetch");
const discord = require("discord.js");
const client = new discord.Client();

client.on("ready", ready => {
  console.log("Client Logged In!");
});

client.on("message", message => {
  if (!message.content.startsWith(prefix)) return;
  const withoutPrefix = message.content.slice(prefix.length);
  const split = withoutPrefix.split(/ +/);
  const command = split[0];
  const args = split.slice(1);
  if (command == "shopify") {
    let link = args[0];
    //get product details
    grabJSON(link)
      .then(async json => {
        let productname = json.product.title;
        let handle = json.product.handle;
        let vendor = json.product.vendor;
        let imagesrc = json.product.image.src;
        console.log(json.product.variants);
      //create our embed
        const exampleEmbed = new discord.MessageEmbed()
          .setColor("#D20069")
          .setTitle(productname)
          .setURL(link)
          .setDescription(
            "Variants of product w/ handle " + handle + " on the site " + vendor
          )
          .setThumbnail(imagesrc)
          .setTimestamp()
          .setFooter(
            "Developed by Carcraftz#5445",
            "https://cdn.discordapp.com/avatars/605463770998898718/a_f47f7b1dbf415cc7601d65cfc45a323c.gif?size=128"
          );
        //add variant links to our embed
        json.product.variants.forEach(variant=>{
          let cleanlink = link.split("?")[0]
          let partarr = cleanlink.split("/")
          cleanlink = partarr.slice(0,3).join("/")
          exampleEmbed.addField(variant.title, "[ATC]("+cleanlink +"/cart/"+variant.id+":1)\n$"+variant.price+"\nWeight: "+variant.weight+" "+variant["weight_unit"]+"\nsku: "+variant.sku, true)

        })
        message.channel.send(exampleEmbed)
      })
      .catch(e => {
        console.log(e);
        message.reply("This is not a valid shopify link!");
      });
  }
});
async function grabJSON(link) {
  //remove query strings from our link
  let parsedlink = link.split("?")[0];
  let response = await fetch(parsedlink + ".json");
  let json = await response.json();
  return json;
}
client.login(token);
