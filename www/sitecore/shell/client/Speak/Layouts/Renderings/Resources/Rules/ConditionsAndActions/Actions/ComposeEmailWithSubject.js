define([], function () {
  var action = function (context, args) {
   var targetDisplayTextID = context.app[args.targetDisplayTextID],
	   targetAdressID = context.app[args.targetAdressID], 
	   targetSubjectID = context.app[args.targetSubjectID], 
	   targetStyleID = context.app[args.targetStyleID],
     htmlEncode = function (str) {
       return str.toString()
         .replace(/&/g, '&amp;')
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#x27;');
     },
	   templateWithSubject = "<link text='<%=displayText%>' linktype='mailto' style='<%=style%>' url='mailto:<%=emailAddress%>?subject=<%=subject%>'  title='' />"; 
	   
	   
   if (!targetDisplayTextID || !targetAdressID || !targetSubjectID || !targetStyleID) {
		console.log("Some of the target controls were not found");
		return false;
	}  
	
	var mailLink = _.template(templateWithSubject,{
                    displayText: htmlEncode(targetDisplayTextID.get("text")),
                    emailAddress: htmlEncode(targetAdressID.get("text")),
                    subject: htmlEncode(targetSubjectID.get("text")),
                    style: htmlEncode(targetStyleID.get("text"))
                });
				
    context.app.closeDialog(mailLink);
  };

  return action;
});
