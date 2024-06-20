
// ========================== VARS ===========================
var myParameters = {};
var myValues = {};
var workspace_name = local.parameters.workspaceID.get() ;
var workspaceNo = local.values.workspaceID.get() ;
var cuecount = local.parameters.numberOfCues.get()  ;
var permFb  ;
var names = [];
var requests = [];
var requestsAdr = [];
var requestsArg = [];
var wild = "*" ;
var parse ;

var cueColors = ["none","berry","blue","crimson","cyan","forest","gray","green","hot pink","indigo","lavender","magenta","midnight","olive","orange","peach","plum","purple","red","sky blue","yellow"] ;


//====================================================================
//						INITIAL FUNCTIONS 
//====================================================================

//  initial functions
function init() {

		
// Insert Parameter Buttons & Infos======>>>>>>>>>>>>>>>>>>>>>>>>

	permFb = local.parameters.addBoolParameter("Permanent Feedback", "Get Permanent Feedback from QLab" , false);
// =====================================================================
// 						VALUES CONTAINERS
// =====================================================================

	cuelistCount = local.values.addIntParameter("CueList Count","Number of Cues", 0, 0);
	cuesNoInfo = local.values.addIntParameter("Cues Count","Number of Cues", 0, 0);
	showCL=local.values.addIntParameter("Show CueList", "Show CueList" , 1);
	nextId = local.values.addStringParameter("Next Cue ID","", "");
	nextCue = local.values.addStringParameter("Next Cue","Next Cue", "Next Cue");	
	activeCue = local.values.addStringParameter("Active Cue","Active Cue", "Active Cue");
//	syncAll = local.values.addTrigger("Sync", "Request Infos" , false);
	
// =====================================================================
// 						CREATE CONTAINERS
// =====================================================================
	
// >>>>>>  Names Container >>>>>>>>>>>>>>>>>>>>>>		
	cues=local.values.addContainer("Cue Names");
		cues.setCollapsed(true);
		cues.addTrigger("Reset Cue Names", "Reset Cue Names" , false);
		cues.addTrigger("Sync Cue Names", "Get Names from Q-Lab" , false);
		cues.addIntParameter("Number of CueLists", "Number of CueLists from Q-Lab" , 1);
		cues.addIntParameter("Number of Cues", "Number of Cues from Q-Lab" , 1);
		cues.addIntParameter("Show CueList", "Show CueList" , 1);
		cues.addStringParameter("CueList Name", "Name of the Cuelist", "");
		read = cues.addStringParameter(" ", "", "Cues Names");
		read.setAttribute("readOnly" ,true);
//		if (cuecount == 0) { cuecount=50 ;}
		for (var n = 1; n <= cuecount; n++) {
			cues.addStringParameter("Cue "+n, "", ""); 
			}

/*			
// >>>>>>  Cue Number Container >>>>>>>>>>>>>>>>>>>>>>		
	cues=local.values.addContainer("Cue Numbers");
		cues.setCollapsed(true);
		cues.addTrigger("Reset Cue Numbers", "Reset Cue Names" , false);
		cues.addTrigger("Sync Cue Numbers", "Get Names from Q-Lab" , false);
		cues.addIntParameter("Number of Cues", "Number of Names from Q-Lab" , 1);
		cues.addStringParameter("CueList Numbers", "Name of the Cuelist", "");
		read = cues.addStringParameter(" ", "", "Cues Numbers");
		read.setAttribute("readOnly" ,true);
//		if (cuecount == 0) { cuecount=50 ;}
		for (var n = 1; n <= cuecount; n++) {
			cues.addStringParameter("Cue "+n, "", ""); 
			}						
*/


			
}

//========================================================================
//							 HELPER
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
//							 VALUE CHANGE EVENTS
//========================================================================

function moduleValueChanged(param) { 

	if (param.name == "syncCueNames"){
	local.send ("/cueLists") ;	
	}
	
	if (param.name == "resetCueNames"){
	local.values.cueNames.cueListName.set("");
 	for (n=1 ; n<=cuecount ; n++)
 	{var child = "cue"+n ;
	local.values.cueNames.getChild(child).set("");}
	}
	
	if (param.name == "sync"){
	local.send ("/alwaysReply" ,1) ;
//	local.send ("/updates", 1) ;
	local.send ("/cueLists") ;
	local.send("/cue/selected/name") ;
//	local.send("/cue/active/name") ;
//	local.send("/cue/playhead/name") ;
	}
	
	
}	

//========================================================================
//							 PARAMETER CHANGE EVENTS
//========================================================================

function moduleParameterChanged(param) { 
	if (param.name == "sync"){
	local.send ("/cueLists") ;
	}
}	

//============================================================
//							OSC EVENTS
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
	// get CueLists-Number
	var lnumb = parse.data.length ;
	local.values.cueNames.numberOfCueLists.set(lnumb);
	local.values.cueListCount.set(lnumb);
	// get Cues-Number
	var numb = parse.data[0].cues.length ;
	local.values.cueNames.numberOfCues.set(numb);
	local.values.cuesCount.set(numb);
	local.parameters.numberOfCues.set(numb);
	//  insert CueList Name
	var listname = parse.data[0].listName ;
	local.values.cueNames.cueListName.set(listname);
	//  insert Workspace ID
	var workspace = parse.workspace_id ;
	local.values.workspaceID.set(workspace);
	local.parameters.workspaceID.set(workspace);
	
	//  insert Cue Names 
	for (n=0 ; n<numb ; n++) {
	var no =n+1 ;	
		var cuename = parse.data[0].cues[n].name ;
		var cuenumber = parse.data[0].cues[n].number ;
		var cuecolor = parse.data[0].cues[n].colorName ;
		if (cuecolor == "none") { cuecolor = "" ;}
		else {cuecolor = " - "+cuecolor ;}
		var fullname = cuenumber+" - "+cuename +cuecolor ;	
		local.values.cueNames.getChild("cue"+no).set(fullname);}
	}




}



//=========================================================
//							 REQUESTS
//=========================================================




//=========================================================
//					 REGULAR FUCNTIONS
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