!function(a,b,c,d){"use strict";a.Bucketlist=function(d){var e,f,g,h,i,j,k,l,m;for(e=[d,a.bucketlistConfig],f=["url","limit"],j=0,l=e.length;l>j;j++)if("undefined"!=typeof e[j])for(k=0,m=f.length;m>k;k++)"undefined"!=typeof e[j][f[k]]&&(this[f[k]]=e[j][f[k]]);if(this.nameIcon={file:"glyphicon-file",directory:"glyphicon-folder-close"},this.nameLabel={file:"label-success",directory:"label-warning"},g={"ap-northeast-1":"s3-ap-northeast-1.amazonaws.com","ap-southeast-1":"s3-ap-southeast-1.amazonaws.com","ap-southeast-2":"s3-ap-southeast-2.amazonaws.com","eu-west-1":"s3-eu-west-1.amazonaws.com","us-east-1":"s3.amazonaws.com","us-west-1":"s3-us-west-1.amazonaws.com","us-west-2":"s3-us-west-2.amazonaws.com","sa-east-1":"s3-sa-east-1.amazonaws.com"},"undefined"==typeof this.url&&(this.url=a.location.host),this.url=this.url.toLowerCase().replace(/^\b.*?\b:/,"").replace(/^\/{1,}/,"").replace(/\/{1,}$/,"").trim(),-1!==this.url.indexOf(".s3-website-"))this.url=this.url.split(".s3-website-"),h=this.url[0].replace(/^\/{1,}/,"").trim(),i=this.url[1].split(".amazonaws.com")[0].replace(/^\/{1,}/,"").replace(/\/{1,}$/,"").trim(),this.url=g[i]+"/"+h;else for(var n in g)if(this.url===g[n]){h=this.url.split("/")[1].replace(/^\/{1,}/,"").replace(/\/{1,}$/,"").trim(),this.url=this.url+"/"+h;break}this.url="//"+this.url,this.url=c("<a></a>").attr("href",this.url)[0],this.url="//"+this.url.hostname+this.url.pathname,this.url=this.url.replace(/\/{1,}$/,"").trim(),"number"==typeof this.limit&&(this.limit=parseInt(this.limit,10)),(isNaN(this.limit)===!0||this.limit<=0)&&(this.limit=100),this.delimiter="/",this.title=b.title.trim(),""===this.title&&(this.title="Bucketlist"),c(function(){this.$title=c("#bucketlist-title"),this.$container=c("#bucketlist-container"),this.$breadcrumb=c("#bucketlist-breadcrumb"),this.$tableBase=c("#bucketlist-table-base"),this.$tableContainer=c("#bucketlist-table-container"),this.$pagerContainer=c("#bucketlist-pager-container"),this.$loaderContainer=c("#bucketlist-loader-container"),this.$errorContainer=c("#bucketlist-error-container"),this.$errorHeading=c("#bucketlist-error-heading"),this.$errorRetry=c("#bucketlist-error-retry"),this.assignTableSelector(),this.$title.text(this.title),this.$pagerContainer.on("click","LI:not(.disabled) > A",function(a){var b=c(a.currentTarget).parent().attr("class");"undefined"!=typeof b&&this.navigatePaginator({action:b})}.bind(this)),c(a).on("hashchange",function(){this.init()}.bind(this)),this.init()}.bind(this))},a.Bucketlist.prototype.init=function(){this.resetPage(),this.resetMarker(),this.navigate()},a.Bucketlist.prototype.resetPage=function(){this.page=0},a.Bucketlist.prototype.resetMarker=function(){this.marker={current:"",index:[""]}},a.Bucketlist.prototype.assignTableSelector=function(){this.$table=c("#bucketlist-table-container > TABLE.bucketlist-table:first")},a.Bucketlist.prototype.showContainer=function(a){a.removeClass("hidden")},a.Bucketlist.prototype.hideContainer=function(a){a.addClass("hidden")},a.Bucketlist.prototype.navigate=function(){var b,c;b=a.location.hash.replace(/^#!\//,"").trim(),b=decodeURIComponent(b),c={prefix:b,delimiter:this.delimiter,marker:this.marker.current,"max-keys":this.limit},this.fetchList(c)},a.Bucketlist.prototype.fetchList=function(a){this.hideContainer(this.$container),this.hideContainer(this.$errorContainer),this.showContainer(this.$loaderContainer),this.$table.empty().remove(),this.$tableContainer.empty().html(this.$tableBase.html()).find("TABLE:first").addClass("bucketlist-table"),this.assignTableSelector(),c.ajax({url:this.url,dataType:"xml",data:c.param(a).replace(/\+/g,"%20"),success:function(b){this.parseReturn({xml:b,prefix:a.prefix})}.bind(this),error:function(b){this.ajaxErrorHandler({error:b,retry:a})}.bind(this)})},a.Bucketlist.prototype.ajaxErrorHandler=function(a){var b="";"undefined"!=typeof a.error&&("undefined"!=typeof a.error.status&&0!==a.error.status&&(b=a.error.status+": "),"undefined"!=typeof a.error.statusText&&"error"!==a.error.statusText&&(b+=a.error.statusText)),""===b&&(b="Error"),this.$errorHeading.empty().text(b),this.$errorRetry.one("click",function(){this.fetchList(a.retry)}.bind(this)),this.hideContainer(this.$container),this.hideContainer(this.$loaderContainer),this.showContainer(this.$errorContainer)},a.Bucketlist.prototype.parseReturn=function(a){var b,d,e;b={},d=c(a.xml),e="",b.files=c.map(d.find("Contents"),function(a){return a=c(a),{name:a.find("Key:first").text(),lastModified:a.find("LastModified:first").text(),size:a.find("Size:first").text(),type:"file"}}),b.dirs=c.map(d.find("CommonPrefixes"),function(a){return a=c(a),{name:a.find("Prefix:first").text(),lastModified:"",size:"0",type:"directory"}}),e=d.find("NextMarker"),e=0!==e.length?e.text():"",""!==e&&(this.marker.index[this.page+1]=e),this.generateTable({list:b,prefix:a.prefix}),this.generateBreadcrumb({prefix:a.prefix}),this.updatePaginator(),this.hideContainer(this.$loaderContainer),this.showContainer(this.$container)},a.Bucketlist.prototype.parseItemSize=function(a){switch(a.bytes){case d:case null:case"":case"0":case 0:return"--"}var b,c;return b=["B","KB","MB","GB","TB"],c=parseInt(Math.floor(Math.log(a.bytes)/Math.log(1024)),10),Math.round(a.bytes/Math.pow(1024,c),2)+" "+b[c]},a.Bucketlist.prototype.generateTable=function(a){var b,d;b=[],d=c(["<tbody>","<tr>",'<td class="type text-center">','<span class="label">','<span class="glyphicon"></span>',"</span>","</td>",'<td class="name">','<a class="bucketlist-name-link"></a>',"</td>",'<td class="last-modified"></td>','<td class="size"></td>',"</tr>","</tbody>"].join(""));for(var e in a.list){var f,g,h;for(f=a.list[e],g=0,h=f.length;h>g;g++){var i,j,k,l,m,n;if(i=f[g].type,j="undefined"!=typeof f[g].name?f[g].name:"--","--"!==j&&(j=j.replace(new RegExp("^"+a.prefix),"","i").trim()),""!==j){switch(d.find("tr:first").attr("class",f[g].type).find("TD.type").attr("data-value",f[g].type).find("SPAN.label").addClass(this.nameLabel[f[g].type]).find("SPAN.glyphicon").addClass(this.nameIcon[f[g].type]),k={parsed:new Date("string"==typeof f[g].lastModified&&""!==f[g].lastModified?f[g].lastModified:0)},k.raw=k.parsed.getTime()/1e3,k.parsed=0===k.parsed.getTime()?"--":k.parsed,l={raw:"string"==typeof f[g].size&&""!==f[g].size?f[g].size:0},l.parsed=this.parseItemSize({bytes:l.raw}),m=j,i){case"directory":m="#!/"+encodeURIComponent(a.prefix+m);break;default:m=this.url+"/"+a.prefix+m}n={name:{href:m,download:"directory"===i?null:j}},d.find("TD.size:first").attr("data-value",l.raw).text(l.parsed),d.find("TD.last-modified:first").attr("data-value",k.raw).text(k.parsed),d.find("TD.name:first A:first").text(j).attr(n.name),b.push(d.html())}}}this.assignTableSelector(),this.$table.attr("data-sortable","").find("tbody:first").empty().html(b.join("")),Sortable.init()},a.Bucketlist.prototype.updatePaginator=function(){var a,b;a=this.$pagerContainer.find("LI.previous:first"),b=this.$pagerContainer.find("LI.next:first"),this.hideContainer(this.$pagerContainer),a.addClass("disabled"),b.addClass("disabled"),this.page>0&&a.removeClass("disabled"),this.page<this.marker.index.length-1&&b.removeClass("disabled"),a.hasClass("disabled")&&b.hasClass("disabled")||this.showContainer(this.$pagerContainer)},a.Bucketlist.prototype.navigatePaginator=function(a){var b;if("string"==typeof a.action){switch(a.action){case"previous":this.page--;break;case"next":this.page++}b=this.marker.index[this.page],"string"==typeof b&&(this.marker.current=b,this.navigate())}},a.Bucketlist.prototype.generateBreadcrumb=function(a){var b,d,e,f,g,h;if(b=[],"string"==typeof a.prefix&&(b=a.prefix.split("/")),d=c('<ol><li><a class="bucketlist-nav" href="#!/">Home</a></li></ol>'),e=[d.html()],f="#!/",g=b.length,g>1)for(h=0,g-=1;g>h;h++){var i=b[h].trim();f=f+i+"/",d.find("LI:first > A:first").text(i).attr("href",f),e.push(d.html())}this.$breadcrumb.empty().html(e.join(""))}}(window,document,jQuery);