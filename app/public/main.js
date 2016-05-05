//CKEDITOR.instances['editor1'].getData()
//CKEDITOR.instances['editor1'].setData("ssss")
function myFunction(){
console.log("AAAAAAAAAA");

      $.ajax({
        type: 'GET',
        url: '/folders',
        success: function(data) {
          //console.log("retour ajax");
          //console.log(data);
          $("#folderList").empty();
          
          for(var i=0;i<data.length;i++)
          {
          	$("#folderList").append('<li class="list-group-item">'+data[i].name+'</li>');
          	//console.log(data[i].name);
          }
      	}
  	});
   
}


function myFunctionAdd(){
console.log('included');
		var mydata ={name:$("#fp").val()};
      $.ajax({
        type: 'POST',
        url: '/folders',
        data : mydata,
        success: function(data) {
          console.log(data);
           myFunction();
      	}
  	});
   
}


function getFolderModal(){


      $.ajax({
        type: 'GET',
        url: '/folders',
        success: function(data) {
          //console.log("retour ajax");
          //console.log(data);
          $("#sel1").empty();
          $("#foldername").val("");
          
          for(var i=0;i<data.length;i++)
          {
            $("#sel1").append('<option value='+data[i].id+'>'+data[i].name+'</option>');
            //console.log(data[i].name);
          }
        }
    });
   
}

function getFolderManageModal(){


      $.ajax({
        type: 'GET',
        url: '/folders',
        success: function(data) {
          //console.log("retour ajax");
          //console.log(data);
          $("#manageFolderList").empty();
          
          for(var i=0;i<data.length;i++)
          {
            

            

            var folder = `<li class='tile' folderid='${data[i].id}' id='${data[i].name}'>
                              <a class='tile-content ink-reaction' href='#2'>
                                <div class='tile-icon'>
                                  <i class='fa fa-folder'></i>
                                </div>
                                <div class='tile-text'>${data[i].name}</div>
                              </a>
                              <a class='btn btn-flat ink-reaction'>
                                <i class='fa fa-trash' value='${data[i].name}'  onclick='deleteFolder(this)'></i>
                              </a>
                            </li>`;
            $("#manageFolderList").append(folder);
          }
        }
    });
   
}


function deleteFolder(name){
  
  name =$(name).attr('value');

  $.ajax({
                type: 'DELETE',
                url: '/folderDeleteByName/'+name,
                success: function(note) {
                  // find id with name and remove it with jquery 
                  $("#main-menu").find('.gui-folder:contains('+name+')').remove();
                  $("#manageFolderList").find('li[id="'+name+'"]').remove();
                }
            });

}

function saveNote(){
    var notedata ={title: $("#usr").val(),content:CKEDITOR.instances['editor1'].getData(),folder: $("#sel1").val()};
      $.ajax({
        type: 'POST',
        url: '/createnote',
        data : notedata,
        success: function(data) {
           //myFunction();
        }
    });
   
}
function folderDelete(a){
    console.log(a);
    console.log(a.id);
        event.stopPropagation();

    $.ajax({
                type: 'DELETE',
                url: '/folderDelete/'+a.id,
                success: function(note) {
                }
            });

      loadfoldersandnotes();

   
}

function loadNote(a){
  //console.log(a);
  //console.log("Inside loadNote note");
  //console.log($(a).closest("li").addClass("active"));
  $("#main-menu").find(".active").removeClass("active");
  $(a).closest("li.gui-folder").addClass("active");
    

  

        $.ajax({
                type: 'GET',
                url: '/notedetail/'+a.id,
                success: function(note) {
                  //console.log(note);
                  $("#noteTitle").empty();
                  //$("#noteTitle").removeAttr('noteId');
                  //console.log("NOTE ID ",note.id);
                  $("#noteTitle").attr('noteId', note.id);
                  $("#noteTitle").val(note.title);
                  $(".note-editable").empty();
                  $(".note-editable").append(note.content);
                  //CKEDITOR.instances['editor'].setData(note.content);
                  
                }
            });

}




function deleteNote(a,from){
  console.log("Inside delete note");
  event.stopPropagation();
  if(from == "menu"){
    noteId=$(a).parent().parent().attr('id');
  }
  else{
    noteId=$("#noteTitle").attr('noteId');
  }
  //noteId=$(a).parent().parent().attr('id');

  $('#delete-file-modal').modal('show');
      

      $('#delete-file-modal .modal-footer button').on('click', function (e) {
          var $target = $(e.target);
          $(this).closest('.modal').on('hidden.bs.modal', function (e) {
              //alert('The buttons id that closed the modal is: #' + $target[0].id);
              if ($target[0].id=="bt_delete") {

                      $.ajax({
                        type: 'DELETE',
                        url: '/notedelete/'+noteId,
                        success: function(note) {
                          console.log(note.notedeleted);
                          if(from =="menu"){
                            if(note.notedeleted==true)
                            {
                             $(a).parent().parent().parent().remove();
                            }
                            else
                            {
                              $('#error-modal').modal('show');
                            }

                          }
                          else{
                            if(note.notedeleted==true)
                            {
                              $("#noteTitle").val("");
                              $(".note-editable").empty();
                              $("#noteTitle").removeAttr("noteid");
                              $("#saveMessage").empty();
                              $(".gui-folder").find('a[id='+noteId+']').parent().remove();
                              $("#main-menu").find(".active").removeClass("active");
                            }
                            else
                            {
                              $('#error-modal').modal('show');
                            }
                           


                          }
                          
                          
                        }
                      });

              };
          });
      });

}


function addNewNote(){ // add button

    // Inutile vu la fonction autosave 
    // $('#save-file-modal').modal('show');
      

    //   $('#save-file-modal .modal-footer button').on('click', function (e) {
    //       var $target = $(e.target);
    //       $(this).closest('.modal').on('hidden.bs.modal', function (e) {
    //           //alert('The buttons id that closed the modal is: #' + $target[0].id);
    //           if ($target[0].id=="bt_delete") {
    //              updateNote();
    //              $("#noteTitle").val("");
    //              $(".note-editable").empty();
    //              noteId :$("#noteTitle").removeAttr("noteid");
    //              $("#saveMessage").empty();


    //           }
    //           else{
    //             $("#noteTitle").val("");
    //             $(".note-editable").empty();
    //             noteId :$("#noteTitle").removeAttr("noteid");
    //             $("#saveMessage").empty();
    //           }
    //       });
    //   });

      $("#noteTitle").val("");
      $(".note-editable").empty();
      $("#noteTitle").removeAttr("noteid");
      $("#saveMessage").empty();

}





function updateNote(){ //save button
  var attr = $("#noteTitle").attr("noteid");
  if(typeof attr !== typeof undefined && attr !== false){
    var notedata ={title: $("#noteTitle").val(),content:$(".note-editable").html(), noteId :$("#noteTitle").attr("noteid")};
      $.ajax({
        type: 'PUT',
        url: '/updateNote',
        data : notedata,
        success: function(data) {

           //myFunction();
        }
    });
  }
  else{ // creation of new note chose-folder-modal
    getFolderModal();
    $('#chose-folder-modal').modal('show');
      
  }
    
   
}


function autoSave(){
  //console.log("Inside autoSave");
  var notedata ={title: $("#noteTitle").val(),content:$(".note-editable").html(), noteId :$("#noteTitle").attr("noteid")};
  //console.log(notedata);
      $.ajax({
        type: 'PUT',
        url: '/updateNote',
        data : notedata,
        success: function(data) {
            //console.log("Inside Ajax");

          var d = new Date();
          $("#saveMessage").empty();
          $("#saveMessage").text("Enregistre automatiquement a "+d.getHours()+" h "+d.getMinutes()+" mm" + d.getSeconds()+" s" );

        }
    });

}

function saveNewNote(){ //save button
  if($('#foldername').prop("disabled")){

    var folder =$("#sel1 option:selected").text();;
    var notedata ={title: $("#noteTitle").val(),content:$(".note-editable").html(),folder: $("#sel1").val()};
    $.ajax({
    type: 'POST',
    url: '/createnote',
    data : notedata,
    success: function(data) {
       //myFunction();
       //console.log(data);
       $("#main-menu").find(".active").removeClass("active");
       $("#main-menu").find('.gui-folder:contains('+folder+')').addClass("active");

      var noteLink = `<li><a href='#' id='${data.id}' class='active' onclick='loadNote(this)'>
            <span class='title'>${data.title}<i style='float: right;' class='md md-delete' onclick='deleteNote(this)'></i>
            </span></a></li>`;
       $("#main-menu").find('.gui-folder:contains('+folder+')').children().next().prepend(noteLink);

        }
    });


  }

  else{

    console.log("Inside else");
    $("#foldername").val();
    // console.log($("#foldername").val());
    // console.log($("#noteTitle").val());
    // console.log($(".note-editable").html());
    


    var foldername ={name:$("#foldername").val()};
      $.ajax({
        type: 'POST',
        url: '/folders',
        data : foldername,
        success: function(data) {
          var folderIcon =`<li class='gui-folder'>
                              <a>
                                <div class='gui-icon'><i class='md md-folder'></i></div>
                                <span class='title'>${data.name}</span>
                              </a>
                              <ul>
                                
                              </ul>
                              </li>`;
          $("#main-menu").append(folderIcon);


          var folder =data.name;
          var notedata ={title: $("#noteTitle").val(),content:$(".note-editable").html(),folder: data.id};
          $.ajax({
          type: 'POST',
          url: '/createnote',
          data : notedata,
          success: function(data) {
             //myFunction();
             console.log(data);
             $("#main-menu").find(".active").removeClass("active");
             $("#main-menu").find('.gui-folder:contains('+folder+')').addClass("active");

            var noteLink = `<li><a href='#' id='${data.id}' class='active' onclick='loadNote(this)'>
                  <span class='title'>${data.title}<i style='float: right;' class='md md-delete' onclick='deleteNote(this)'></i>
                  </span></a></li>`;
             $("#main-menu").find('.gui-folder:contains('+folder+')').children().next().prepend(noteLink);

              }
          });


        }
    });
       // Object {id: 9, name: "Folder 4", updatedAt: "2016-05-03T02:43:05.623Z", createdAt: "2016-05-03T02:43:05.623Z"}
 //    });

  }
  
}


function search(){
    event.stopPropagation();
 
    var searchKeywords=$("#searchInput").val();
    var account_type=$(".profile-info").attr("account");
    var userEmail=$(".profile-info").text().trim();
    var searchData ={keyword: searchKeywords,email:userEmail,account:account_type};
        
    $.ajax({

      type: 'POST',
      url: '/notesearch',
      data : searchData,
      success: function(notes) {
        //console.log(notes);
        //.substring(0,length);
        //console.log
        //(notes);
        $(".result").remove();
        for(var j =0;j<notes.length;j++)
        {
          var content =notes[j].content;
          //${notes[j].content}.substring(0,100);
          var truncateContent=content.substring(0,200);
          //console.log(truncateContent);

          var note = `<li class='tile result'>
                          <a class='tile-content ink-reaction' >
                          <p>
                          <a class='text-medium text-lg text-primary' href='#' id='${notes[j].id}' onclick="loadNote(this)">${notes[j].title}</a><br/>
                          </p>
                          <div class="contain-xs pull-left">
                            
                            ${truncateContent}
                          </div>
                          </a>
                          </li>
                          <li class="tile divider-full-bleed result"></li>`;
          $("#searchResult").append(note);     
          console.log(note);
          
        }
        

      }
    });
           
     
  
}


// function deletenote(a){
//     console.log(a);
//     //console.log(a.id);
//     //console.log("lien",a.children.length);
//     event.stopPropagation();
//     console.log(a.children.length>=1);

//     if(a.children.length>=1)
//     {
//       console.log("Clicked on delete FALSE");
//       $.ajax({
//                 type: 'GET',
//                 url: '/notedetail/'+a.id,
//                 success: function(note) {
//                   $("#noteTitle").empty();
//                   $("#noteTitle").append(note.title);
//                   $(".note-editable").empty();
//                   $(".note-editable").append(note.content);
//                   //CKEDITOR.instances['editor'].setData(note.content);
                  
//                 }
//             });

//     }
//     else if(a.children.length ==0){
//       console.log("Clicked on delete TRUE");

//       $('#delete-file-modal').modal('show');
      

//       $('#delete-file-modal .modal-footer button').on('click', function (e) {
//           var $target = $(e.target);
//           $(this).closest('.modal').on('hidden.bs.modal', function (e) {
//               //alert('The buttons id that closed the modal is: #' + $target[0].id);
//               if ($target[0].id=="bt_delete") {

//                       $.ajax({
//                         type: 'DELETE',
//                         url: '/notedelete/'+a.id,
//                         success: function(note) {
//                           console.log(note.notedeleted);
//                           if(note.notedeleted==true)
//                           {
//                             $("#sidemenu").find("#"+a.id+"").remove();
//                           }
//                           else
//                           {
//                             $('#error-modal').modal('show');
//                           }
                          
//                         }
//                       });

//               };
//           });
//       });
//       //console.log(a.id);



      
      
//     }

   
// }

// var sidebar_content;

// function search(){
//   if($( "#searchicon" ).hasClass( "glyphicon-ok" ))
//         {

//           var s =$("#searchbox").val();
//           $("#btsearch").find("#searchicon").removeClass("glyphicon glyphicon-ok").addClass("glyphicon glyphicon-remove");
//           var html="";
//           html+="<li class='panel panel-default' id='dropdown'>";
//           html+="<a data-toggle='collapse' href='#folder' >";
//           html+="<span class='glyphicon glyphicon-user'></span> Resultat de la recherche <span class='caret'></span></a>";
//           html+="<div id='folder' class='panel-collapse collapse in'><div class='panel-body'><ul class='nav navbar-nav'>";
        
            
//             $.ajax({
//                 type: 'GET',
//                 url: '/notesearch/'+s,
//                 async:false,
//                 success: function(notes) {
//                   //console.log
//                   //(notes);
//                   for(var j =0;j<notes.length;j++)
//                   {
//                     html+="<li><a href='#' id='"+notes[j].id+"' onclick='deletenote(this)'>"+notes[j].title+"<span class='glyphicon glyphicon-trash pull-right' aria-hidden='true' id='"+notes[j].id+"' onclick='delete(this)'></span></a></li>";
//                   }
                  

//                 }
//             });
           
//             html+="</ul></div></div></li>";
//             sidebar_content =$("#sidemenu").html();
//             $("#sidemenu").empty();
//             $("#sidemenu").append(html);
            


//         }
//         else
//         {
//           $("#btsearch").find("#searchicon").removeClass("glyphicon glyphicon-remove").addClass("glyphicon glyphicon-ok");
//           $("#searchbox").val("");
//           //loadfoldersandnotes();
//           $("#sidemenu").empty();
//           console.log(sidebar_content);
//           $("#sidemenu").append(sidebar_content);
//         }
  
// }

// $("#btsearch").click(function () {
//   console.log("aaaaaaaaaaaaaaaaaaaaaaaaa");
        

        /// uncomment code for absolute positioning tweek see top comment in css
        //$('.absolute-wrapper').removeClass('slide-in');

   // });

//function loadfoldersandnotesdfolder(a){
  /*var html="";
  $.ajax({
        type: 'GET',
        url: '/folders',
        async:false,
        success: function(data) {
          for(var i=0;i<data.length;i++)
          {
            //$("#folderList").append('<li class="list-group-item">'+data[i].name+'</li>');
            html +="<div class='panel panel-default'>";
            html += "<div class='panel-heading'><h4 class='panel-title'>";
            html += "<a data-toggle='collapse' data-parent='#accordion' href='#"+data[i].name.replace(' ' ,'_')+"'><span class='glyphicon glyphicon-folder-close'>";
            html +="</span>"+data[i].name+"<span class='glyphicon glyphicon-trash pull-right' id='"+data[i].id+"' onclick='folderDelete(this)'></span>";
            html +="</a></h4></div><div id='"+data[i].name.replace(' ' ,'_')+"' class='panel-collapse collapse in'>";
            html +="<div class='list-group'>";
            var notelist ="";
            $.ajax({
                type: 'GET',
                url: '/notes/'+data[i].id,
                async:false,
                success: function(notes) {
                  //console.log(notes);
                  for(var j =0;j<notes.length;j++)
                  {
                    html +="<a class='list-group-item' id='"+notes[j].id+"' onclick='delete(this)'>"+notes[j].title+"<span class='glyphicon glyphicon-trash pull-right' aria-hidden='true' id='"+notes[j].id+"' onclick='delete(this)'></span></a>";
                  }
                  

                }
            });
           
            html +="</div>";
            html +="</div>";
            html +="</div>";
            $("#accordion").empty();
            $("#accordion").append(html);
          }*/

          /*console.log('div content');
          console.log(html);
          $("#accordion").empty();
          $("#accordion").append(html);*/
  /*      }
    });

}*/
/*function loadfoldersandnotes(a){
  var html="";
  $.ajax({
        type: 'GET',
        url: '/folders',
        //async:false,
        success: function(data) {

          for(var i=0;i<data.length;i++)
          {
            html += `<li class='panel panel-default' id='dropdown'>
                     <a data-toggle='collapse' href='#_${data[i].id}' >
                     <span class='glyphicon glyphicon-user'></span>${data[i].name}<span class='caret'></span></a>
                     <div id='_${data[i].id}' class='panel-collapse collapse'><div class='panel-body'><ul class='nav navbar-nav'>`;
            

            $.ajax({
                type: 'GET',
                url: '/notes/'+data[i].id,
                async:false,
                success: function(notes) {
                  
                  for(var j =0;j<notes.length;j++)
                  {
                    html+="<li><a href='#' id='"+notes[j].id+"' onclick='delete(this)'>"+notes[j].title+"<span class='glyphicon glyphicon-trash pull-right' aria-hidden='true' id='"+notes[j].id+"' onclick='delete(this)'></span></a></li>";
                  }
                  

                }
            });
           
            html+="</ul></div></div></li>";
            $("#sidemenu").empty();
            $("#sidemenu").append(html);
            
          }

          /*console.log('div content');
          console.log(html);
          $("#accordion").empty();
          $("#accordion").append(html);*/
/*        }
    });

  
    
}*/


