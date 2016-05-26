//CKEDITOR.instances['editor1'].getData()
//CKEDITOR.instances['editor1'].setData("ssss")

function chat(){
    
}

function myFunction() {
    console.log("AAAAAAAAAA");

    $.ajax({
        type: 'GET',
        url: '/folders',
        success: function(data) {
            //console.log("retour ajax");
            //console.log(data);
            $("#folderList").empty();

            for (var i = 0; i < data.length; i++) {
                $("#folderList").append('<li class="list-group-item">' + data[i].name + '</li>');
                //console.log(data[i].name);
            }
        }
    });

}


function myFunctionAdd() {
    console.log('included');
    var mydata = {
        name: $("#fp").val()
    };
    $.ajax({
        type: 'POST',
        url: '/folders',
        data: mydata,
        success: function(data) {
            console.log(data);
            myFunction();
        }
    });

}


function getFolderModal() {


    $.ajax({
        type: 'GET',
        url: '/folders',
        success: function(data) {
            //console.log("retour ajax");
            //console.log(data);
            $("#sel1").empty();
            $("#foldername").val("");

            for (var i = 0; i < data.length; i++) {
                $("#sel1").append('<option value=' + data[i].id + '>' + data[i].name + '</option>');
                //console.log(data[i].name);
            }
        }
    });

}

function getFolderManageModal() {


    $.ajax({
        type: 'GET',
        url: '/folders',
        success: function(data) {
            //console.log("retour ajax");
            //console.log(data);
            $("#manageFolderList").empty();

            for (var i = 0; i < data.length; i++) {




                var folder = `<li class='tile' folderid='${data[i].id}' id='${data[i].name}'>
                              <a class='tile-content ink-reaction' href='#'>
                                <div class='tile-icon'>
                                  <i class='fa fa-folder'></i>
                                </div>
                                <div class='tile-text'>${data[i].name}</div>
                              </a>
                              <a class='btn btn-flat ink-reaction'>
                                <i class='fa fa-edit' editFolderId='${data[i].id}' value='${data[i].name}'  onclick='editFolderName(this)'></i>
                              </a>
                              <a class='btn btn-flat ink-reaction'>
                                <i class='fa fa-trash' idFolder='${data[i].id}' value='${data[i].name}'  onclick='deleteFolder(this)'></i>
                              </a>
                            </li>`;
                $("#manageFolderList").append(folder);
            }
        }
    });

}

function editFolderName(icon){

    if($(icon).attr('class') =='fa fa-edit'){ // if edit icon is clicked
        var newIcon = `<a class='btn btn-flat ink-reaction'>
                    <i class='fa fa-remove' onclick='editFolderName(this)'></i>
                  </a>`;

        var newDivContent =`<div class='tile-text'><input type='text' placeholder='Nom du dossier' class='form-control' id='newfoldername_${$(icon).attr('editFolderId')}' value='${$(icon).attr('value')}'></div>`;
        
        // changing the edit icon de check icon
        $(icon).removeAttr('class');
        $(icon).attr('class',"fa fa-check-square");
        
        // adding the cancel icon
        $("#manageFolderList [folderid='" + $(icon).attr('editFolderId') + "'] .fa-check-square").parent().after(newIcon);
        
        // replacing the div with the new containing an input for editing
        $(icon).parent().prev().children(':nth-child(2)').replaceWith(newDivContent);

    }
    else if($(icon).attr('class') =='fa fa-remove'){ // if cancel icon is clicked
        //$("#manageFolderList").find('li[folderid="' + $(icon).attr('editFolderId') + '"]').find('.fa-remove').parent().remove();
        var initialFolderName =$(icon).parent().prev().children().attr('value');
        var newDivContent = `<div class='tile-text'>${initialFolderName}</div>`;
        
        $(icon).parent().prev().prev().children(':nth-child(2)').replaceWith(newDivContent);

        //changing the save icon to edit icon
        $(icon).parent().prev().children().removeAttr('class');
        $(icon).parent().prev().children().attr('class',"fa fa-edit");
        //remove the cancel icon
        $(icon).parent().remove();
    }
    else{
        $(icon).removeAttr('class');
        $(icon).attr('class',"fa fa-edit");
        var newFoldernameId = "#newfoldername_"+$(icon).attr('editfolderid');

        $("#manageFolderList").find('li[folderid="' + $(icon).attr('editFolderId') + '"]').find('.fa-remove').parent().remove();
        var newDivContent = `<div class='tile-text'>${$(newFoldernameId).val()}</div>`;
        console.log(newDivContent);

        var folderData = {
            folderId: $(icon).attr('editFolderId'),
            newFoldername: $(newFoldernameId).val()
        };
        $.ajax({
            type: 'PUT',
            url: '/updateFolderName',
            data: folderData,
            success: function(data) {
                var newFoldername=$(newFoldernameId).val();

                $(icon).parent().prev().children(':nth-child(2)').replaceWith(newDivContent);
                $("#main-menu span[fid='"+$(icon).attr('editFolderId') +"']").text(newFoldername);
                $("#folderList").find('a[folderid=' +$(icon).attr('editFolderId') + ']').text(newFoldername);
                if($("#currentFolder ").text().trim()==$(icon).attr('value'))
                $("#currentFolder").text(newFoldername);

                //update editfolderid attribute of edit button
                $("#manageFolderList i[editfolderid="+$(icon).attr('editfolderid')+"]").removeAttr('value');
                $("#manageFolderList i[editfolderid="+$(icon).attr('editfolderid')+"]").attr('value',newFoldername);
                    

            },
            error: function(errResponse) {
                console.log(errResponse);
                $('#error-save-modal').modal('show');
                    
            }
        });
    }
    

}

function deleteFolder(name) {

    var idFolder = $(name).attr('idFolder');
    

    $.ajax({
        type: 'DELETE',
        url: '/folderDelete/' + idFolder,
        success: function(note) {
            // find id with name and remove it with jquery 
            //$("#main-menu").find('.gui-folder:contains('+name+')').remove();
            console.log("idFolder",idFolder);
            $("#main-menu").find('span[fid="' + idFolder + '"]').parent().parent().remove()
            $("#manageFolderList").find('li[folderid="' + idFolder + '"]').remove();
            $("#folderList").find('a[folderid=' +idFolder + ']').parent().remove(); 
            $(".gui-folder").find('li').children().trigger("click");
        }
    });

}


function folderDelete(a) {
    console.log(a);
    console.log(a.id);
    event.stopPropagation();

    $.ajax({
        type: 'DELETE',
        url: '/folderDelete/' + a.id,
        success: function(note) {}
    });

    loadfoldersandnotes();


}

function loadNote(a) {
    //console.log(a);
    //console.log("Inside loadNote note");
    //console.log($(a).closest("li").addClass("active"));
    $("#main-menu").find(".active").removeClass("active");
    $(a).closest("li.gui-folder").addClass("active");
    $("#currentFolder").show(); // in case it's hidden




    $.ajax({
        type: 'GET',
        url: '/notedetail/' + a.id,
        success: function(note) {
            //console.log(note);
            $("#noteTitle").empty();
            $("#noteTitle").attr('noteId', note.id);
            $("#noteTitle").val(note.title);
            $(".note-editable").empty();
            $(".note-editable").append(note.content);
            //console.log(note.folderId);
            $("#folderList").find('a[folderid=' + note.folderId + ']').trigger("click");

        }
    });

}


// function used to change the folder of a note

function changeNoteFolder(folderSelected){

    //hides the duplicate folder in the list on first load
    if($(folderSelected).attr("folderId")==$("#currentFolder").attr("selectedFolderId")){
        $(folderSelected).hide();
        return;
    }


    var noteId = $("#noteTitle").attr("noteid");
    var noteTitle = $("#noteTitle").val();
    var icon = "<i class='fa fa-caret-down text-default-light' style='margin-left: 7px;'></i>";
    var folderSelectedText=$(folderSelected).text(); // get the text of the folder selected

    
    $(folderSelected).hide(); // hide the selected folder from the list
    $("#currentFolder").text(folderSelectedText); // assign the text of the selected folder in the list to the actual folder of the note
    $("#currentFolder").append(icon); // add the carret of the dropdown


    // make appear the previous selected folder in the list since it was hidden initially
    $("#folderList").find('a[folderid=' +$("#currentFolder").attr("selectedFolderId") + ']').show(); 

    //assign the id of the chosen item in the list as the id of the selected folder
    $("#currentFolder").attr("selectedFolderId",$(folderSelected).attr("folderid"));


    var originalFolderId = $(".gui-folder").find('a[id=' + noteId + ']').parent().parent().prev().children().next().attr("fid");


    // compare the id of the sleected folder in the list and the original folder id of the note
    // this avoid unnecessary ajax request
    if($(folderSelected).attr("folderid")!= originalFolderId ){

    var data = {
        folderId: $(folderSelected).attr("folderid")
    };
    $.ajax({
        type: 'PUT',
        url: '/updateNoteFolder/'+noteId,
        data: data,
        success: function(data) {

            // make the relevant changes to the ui

            $("#main-menu").find(".active").removeClass("active");
            $("#main-menu").find('.gui-folder:contains(' + folderSelectedText + ')').addClass("active");
            $(".gui-folder").find('a[id=' + noteId + ']').parent().remove();

            var noteLink = `<li><a href='#' id='${noteId}' class='active' onclick='loadNote(this)'>
            <span class='title'>${noteTitle}<i style='float: right;' class='md md-delete' onclick='deleteNote(this)'></i>
            </span></a></li>`;
                $("#main-menu").find('.gui-folder:contains(' + folderSelectedText + ')').children().next().prepend(noteLink);
                $(".gui-folder").find('li.active:first').children().trigger("click");
                $("#main-menu").find('.gui-folder:contains(' + folderSelectedText + ')').find(".gui-icon").trigger("click");
                $(".gui-folder").find('a[id=' + noteId + ']').trigger("click"); // triggers click in order to expand the folder

        },
        error: function(errResponse) {
            console.log(errResponse);
            $('#error-save-modal').modal('show');
                
        }
    });

    }

}




function deleteNote(a, from) {
    console.log("Inside delete note");
    event.stopPropagation();
    if (from == "menu") {
        noteId = $(a).parent().parent().attr('id');
    } else {
        noteId = $("#noteTitle").attr('noteId');
    }
    //noteId=$(a).parent().parent().attr('id');

    $('#delete-file-modal').modal('show');


    $('#delete-file-modal .modal-footer button').on('click', function(e) {
        var $target = $(e.target);
        $(this).closest('.modal').on('hidden.bs.modal', function(e) {
            //alert('The buttons id that closed the modal is: #' + $target[0].id);
            if ($target[0].id == "bt_delete") {

                $.ajax({
                    type: 'DELETE',
                    url: '/notedelete/' + noteId,
                    success: function(note) {
                        console.log(note.notedeleted);
                        if (from == "menu") {
                            if (note.notedeleted == true) {
                                $(a).parent().parent().parent().remove();
                            } else {
                                $('#error-modal').modal('show');
                            }

                        } else {
                            if (note.notedeleted == true) {
                                $("#noteTitle").val("");
                                $(".note-editable").empty();
                                $("#noteTitle").removeAttr("noteid");
                                $("#saveMessage").empty();
                                $(".gui-folder").find('a[id=' + noteId + ']').parent().remove();
                                $("#main-menu").find(".active").removeClass("active");
                            } else {
                                $('#error-modal').modal('show');
                            }



                        }


                    }
                });

            };
        });
    });

}


function addNewNote() { 
    $("#currentFolder").hide();
    $("#noteTitle").val("");
    $(".note-editable").empty();
    $("#noteTitle").removeAttr("noteid");
    $("#saveMessage").empty();

}

function testf(){
    $('#upload-modal').modal('show');
}


function uploadProfilePicture(image){
    var fileExtension = $(image).val().substring( $(image).val().lastIndexOf('.'));
    var control=$(image);

    //Creating form data for posting image
    var form_data = new FormData();                 
    form_data.append("userPhoto", $(image).prop("files")[0]);   
 
    $.ajax({
        url: "/uploadProfilePicture",
        dataType: 'script',

        // cache - contentType - processData need to be set to false for posting image
        cache: false,
        contentType: false,
        processData: false,
        data: form_data,                        
        type: 'post',
        success: function(data) {
                var userEmail = $(".profile-info").text().trim();
                //removing current image and assigning new image with randon parameter for clearing the old one from cache
                $("#avatar").removeAttr("src");
                $("#avatar").attr("src","../../assets/avatar/"+userEmail+fileExtension+"?"+Math.random()*9999);
                // clearing input control to force the change event to occur in case of choosing an image with same name
                control.replaceWith( control = control.clone( true ) );
            },
        error: function(errResponse) {
                $('#error-save-modal').modal('show');
                
            }
    });

}





//triggered when save button is clicked
function updateNote() { 
    var attr = $("#noteTitle").attr("noteid");
    if (typeof attr !== typeof undefined && attr !== false) {
        autoSave();

    } else { // creation of new note chose-folder-modal
        getFolderModal();
        $('#chose-folder-modal').modal('show');

    }


}


function autoSave() {
    //console.log("Inside autoSave");
    var notedata = {
        title: $("#noteTitle").val(),
        content: $(".note-editable").html(),
        noteId: $("#noteTitle").attr("noteid")
    };
    //console.log(notedata);
    $.ajax({
        type: 'PUT',
        url: '/updateNote',
        data: notedata,
        success: function(data) {
            //console.log("Inside Ajax");

            var d = new Date();
            $("#saveMessage").empty();
            $("#saveMessage").text("Enregistre automatiquement a " + d.getHours() + " h " + d.getMinutes() + " mm" + d.getSeconds() + " s");

        }
    });

}

function saveNewNote() { //save button
    if ($('#foldername').prop("disabled")) {

        var folder = $("#sel1 option:selected").text();;
        var notedata = {
            title: $("#noteTitle").val(),
            content: $(".note-editable").html(),
            folder: $("#sel1").val()
        };
        $.ajax({
            type: 'POST',
            url: '/createnote',
            data: notedata,
            success: function(data) {
                //myFunction();
                //console.log(data);
                $("#main-menu").find(".active").removeClass("active");
                $("#main-menu").find('.gui-folder:contains(' + folder + ')').addClass("active");

                var noteLink = `<li><a href='#' id='${data.id}' class='active' onclick='loadNote(this)'>
                <span class='title'>${data.title}<i style='float: right;' class='md md-delete' onclick='deleteNote(this)'></i>
                </span></a></li>`;
                $("#main-menu").find('.gui-folder:contains(' + folder + ')').children().next().prepend(noteLink);
                $("#currentFolder").show(); // in case it's hidden

            }
        });


    } else {

        console.log("Inside else");
        $("#foldername").val();




        var foldername = {
            name: $("#foldername").val()
        };
        $.ajax({
            type: 'POST',
            url: '/folders',
            data: foldername,
            success: function(data) {
                var folderIcon = `<li class='gui-folder'>
                              <a>
                                <div class='gui-icon'><i class='md md-folder'></i></div>
                                <span class='title' fid='${data.id}'>${data.name}</span>
                              </a>
                              <ul>
                                
                              </ul>
                              </li>`;
                $("#main-menu").append(folderIcon);


                var folder = data.name;
                var folderId = data.id;
                var notedata = {
                    title: $("#noteTitle").val(),
                    content: $(".note-editable").html(),
                    folder: data.id
                };
                $.ajax({
                    type: 'POST',
                    url: '/createnote',
                    data: notedata,
                    success: function(data) {
                        //myFunction();
                        console.log(data);
                        $("#main-menu").find(".active").removeClass("active");
                        $("#main-menu").find('.gui-folder:contains(' + folder + ')').addClass("active");

                        var noteLink = `<li><a href='#' id='${data.id}' class='active' onclick='loadNote(this)'>
                  <span class='title'>${data.title}<i style='float: right;' class='md md-delete' onclick='deleteNote(this)'></i>
                  </span></a></li>`;
                        $("#main-menu").find('.gui-folder:contains(' + folder + ')').children().next().prepend(noteLink);

                        //<li><a href="#" folderid="<%= data[i].id %>" onclick="changeNoteFolder(this)"><%= data[i].name %></a></li>

                        var dropdownFolder =`<li><a href="#" folderid='${folderId}' onclick="changeNoteFolder(this)">${folder}</a></li>`;
                        $("#folderList").append(dropdownFolder);
                        $("#currentFolder").show(); // in case it's hidden
                    }
                });


            }
        });
        // Object {id: 9, name: "Folder 4", updatedAt: "2016-05-03T02:43:05.623Z", createdAt: "2016-05-03T02:43:05.623Z"}
        //    });

    }

}


function search() {
    event.stopPropagation();

    var searchKeywords = $("#searchInput").val();
    var account_type = $(".profile-info").attr("account");
    var userEmail = $(".profile-info").text().trim();
    var searchData = {
        keyword: searchKeywords,
        email: userEmail,
        account: account_type
    };

    $.ajax({

        type: 'POST',
        url: '/notesearch',
        data: searchData,
        success: function(notes) {
            console.log("====NOTES=======");
            console.log(notes);
            console.log("===========");
            //.substring(0,length);
            //console.log
            //(notes);
            $(".result").remove();
            for (var j = 0; j < notes.length; j++) {
                var content = notes[j].content;
                //${notes[j].content}.substring(0,100);
                var truncateContent = content.substring(0, 400);
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
                console.log("===========");
                console.log(note);
                console.log("===========");
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