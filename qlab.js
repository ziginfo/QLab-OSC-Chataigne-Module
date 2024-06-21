
// ========================== VARS ===========================
var myParameters = {};
var myValues = {};
var workspace_name = local.parameters.workspaceID.get() ;
var cuecount = local.parameters.numberOfCues.get()  ;
var workspaceNo = local.values.workspaceID.get() ;
var permFb  ;
var names = [];
var requests = [];
var requestsAdr = [];
var requestsArg = [];
var wild = "*" ;
var parse ;

var cueColors = ["none","berry","blue","crimson","cyan","forest","gray","green","hot pink","indigo","lavender","magenta","midnight","olive","orange","peach","plum","purple","red","sky blue","yellow"] ;


//====================================================================
//		INITIAL FUNCTIONS 
//====================================================================

//  initial functions
function init() {

		
// Insert Parameter Buttons & Infos======>>>>>>>>>>>>>>>>>>>>>>>>

	permFb = local.parameters.addBoolParameter("Permanent Feedback", "Get Permanent Feedback from QLab" , false);
// =====================================================================
// 		VALUES CONTAINERS
// =====================================================================


	
// =====================================================================
// 		CREATE CONTAINERS
// =====================================================================



//		local.values.cueNames.countOfCueList.set(10) ;
//		local.values.cueNames.activeCueList.set(0) ;
//		local.values.cueNames.numberOfCues.set(20) ;
			
}

//========================================================================
//		HELPER
//========================================================================

function update(deltaTime) {
		var now = util.getTime();
		if(now > TSSendAlive) {
			TSSendAlive = now + 2; 
			keepAlive(); 
		 } }
		
function keepAlive() {
		if (permFb.get()) {
		local.send ("/cueLists") ;
		local.send("/cue/selected/name") ;}
//		local.send ("/alwaysReply" ,1) ;
//		local.send ("/updates" ,1) ;
		
}

//========================================================================
//		 VALUE CHANGE EVENTS
//========================================================================

function moduleValueChanged(value) { 
	if (value.name == "syncCueNames"){
	
	local.send ("/cueLists") ;	
	}
	
	if (value.name == "resetCueNames"){
	local.values.cueNames.cueListName.set("");
 	for (n=1 ; n<=cuecount ; n++)
 	{var child = "cue"+n ;
	local.values.cueNames.getChild(child).set("");}
	}
	
	if (value.name == "sync"){
	local.send ("/alwaysReply" ,1) ;
	local.send ("/cueLists") ;
	local.send("/cue/selected/name") ;
//	local.send("/cue/active/name") ;
//	local.send("/cue/playhead/name") ;
	}

// Reset CuelistCount	
	if (value.name == "countOfCueLists"){
	var clcount = local.values.cueNames.countOfCueLists.get();
	if (clcount == 1) {
	local.values.cueNames.activeCueList.set(0);}  }
	
// delete older Cue-Names	
	if (value.name == "activeCueList"){
	var count = local.values.cueNames.numberOfCues.get();
	for (n=1 ; n<=count ; n++)
 	{var child = "cue"+n ;
	local.values.cueNames.getChild(child).set("");}  }
	
//  create Cue-Name-Lines
	if (value.name == "activeCueList" || value.name == "syncCueNames" || value.name == "numberOfCues"){
	cuecount = local.values.cueNames.numberOfCues.get()  ;
//	local.values.cueNames.test.set(value.val) ;
	for (var n = 1; n <= cuecount; n++) {
			local.values.cueNames.addStringParameter("Cue "+n, "", "");  } }

	
	
}	

//========================================================================
//		 PARAMETER CHANGE EVENTS
//========================================================================

function moduleParameterChanged(param) { 
	if (param.name == "sync"){
	local.send ("/cueLists") ;
	}
}	

//============================================================
//		OSC EVENTS
//============================================================

function oscEvent(address, args) { 

/*
//>>>>>>>>>>> Set Workspace
	if (address == "/reply/updates" ) {	
	var parse = JSON.parse(args[0]) ;
		parse = parse.workspace_id ;
	local.values.workspaceID.set(parse);
	local.values.cueNames.list.set(workspace);
	}
*/
		
// >>>>>>>>>Get and Set selected and active Cue
	if (local.match(address,"/reply/cue_id/*/name")) {	
	var parse = JSON.parse(args[0]) ;
		var name = parse.data ;
		var id = parse.address ;
		id = id.replace("/cue_id/","") ;
		id = id.replace("/name","") ;
	local.values.nextCue.set(name);
	local.values.nextCueID.set(id) ;
	}
		
// >>>>>>> Get and Set  Cue Infos
	if (local.match(address,"/reply/workspace/*/cueLists")) {	
	var parse = JSON.parse(args[0]) ;
// set CueListNumber
	var cln = local.values.cueNames.activeCueList.get() ;
// get CueLists-Number
	var lnumb = parse.data.length ;
	local.values.cueNames.countOfCueLists.set(lnumb);
	local.parameters.numberOfCueLists.set(lnumb);
//	local.values.cueListCount.set(lnumb);
// get Cues-Number
	var numb = parse.data[cln].cues.length ;
	local.values.cueNames.numberOfCues.set(numb);
//	local.values.cuesCount.set(numb);
	local.parameters.numberOfCues.set(numb);
//  insert CueList Name
	var listname = parse.data[cln].listName ;
	local.values.cueNames.cueListName.set(listname);
//  insert Workspace ID
	var workspace = parse.workspace_id ;
	local.values.workspaceID.set(workspace);
	local.parameters.workspaceID.set(workspace);
	
//  insert Cue Names 
	for (n=0 ; n<numb ; n++) {
	var no =n+1 ;	
		var cuename = parse.data[cln].cues[n].name ;
		var cuenumber = parse.data[cln].cues[n].number ;
		var cuecolor = parse.data[cln].cues[n].colorName ;
		if (cuecolor == "none") { cuecolor = "" ;}
		else {cuecolor = " - "+cuecolor ;}
		var fullname = cuenumber+" - "+cuename +cuecolor ;	
		local.values.cueNames.getChild("cue"+no).set(fullname);}
	}




}



//=========================================================
//		 REQUESTS
//=========================================================




//=========================================================
//		 REGULAR FUCNTIONS
//=========================================================

// >>>>>>> CUE CONTROL

function go() {
	local.send("/go") ;	
}

function pause() {
	local.send("/pause") ;	
}

function resume() {
	local.send("/resume") ;	
}

function stop_cue(cue) {
	local.send("/cue/"+cue+"/stop") ;	
}

function back() {
	local.send("/playhead/previous") ;	
}

function next() {
	local.send("/playhead/next") ;	
}

function stop_play() {
	local.send("/panicinTime") ;	
}

function stop_all() {
	local.send("/panic") ;	
}

function set_next(cue) {
	local.send("/cue/"+cue+"/loadAndSetPlayhead");	
}

function start_next(cue) {
	local.send("/cue/"+cue+"/startAndAutoloadNext");	
}

function reset(no) {
	local.send("/cue/"+no+"/reset") ;	
}

function reset_act(no) {
	local.send("/cue/cueNumber/reset") ;	
}


function prewait_act(val) {
	
	local.send("/cue/selected/preWait" , val) ;	
}

function postwait_act(val) {
	
	local.send("/cue/selected/postWait" , val) ;	
}

// >>>>>>>>>>> CUE FEEDBACK

function active_cue() {
	local.send("/cue/active/name") ;	
}

function selected_cue() {
	local.send("/cue/selected/name") ;	
}

function playhead_cue() {
	local.send("/cue/playhead/name") ;	
}

// >>>>>>>>>>> CUE ACTIONS

function rename_cue(cue, name) {
	local.send("/cue/"+cue+"/name", name);	
}

function renumber_cues(work, val1, val2) {
	local.send("/workspace/"+work+"/renumber", [val1, val2]) ;
}

// >>>>>>>>>>> AUDIO VOLUME

function actVol_at(val) {
//	val=Math.round(val);
	local.send("/cue/active/level/0/0" , val) ;	
}

function actVol_nominal() {
	local.send("/cue/active/level/0/0", 0) ;	
	
}
function actVol_off() {
	local.send("/cue/active/level/0/0", -930) ;	
}

function actVol_full() {
	local.send("/cue/active/level/0/0", 12) ;	
}


//>>>>>>>>>>>> OSC Requests

function request_names() {
	local.send("/cue/*/name") ;
}

function request_selcue() {
	local.send("/cue/selected/name") ;
}

function request_cuelists() {
	local.send("/cueLists") ;
}

function request_uniqueids() {
	local.send("/cueLists/uniqueIDs") ;
}

function reply(val) {
	local.send("/alwaysReply" , val);	
}

function updates(val) {
	local.send("/updates", val);	
}

function now_playing() {
	local.send("/mix16apps/playlist/playingcue");	
}

function next_playing() {
	local.send("/mix16apps/playlist/nextcue");	
}