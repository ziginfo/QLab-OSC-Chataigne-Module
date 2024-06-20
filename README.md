## QLab extended Control and Feedback with Chataigne over OSC

OSC ports are set by default ! QLab is listening on Port 53000 and sending Feedback on Port 53001 ; so in Chataigne the ports must be set to : Input Port : 53001 and Output Port : 53000

You'll find this QLab Module in the Chataigne Module-Menu under "Software" with the name : "QLab-OSC-Advanced".

This Module gives extended Remote-Control on QLab. And you'll get Feedback for Cue-Lists, Cue-Names, and Cue-Colors etc etc...   
As the CueName-Container is handled dynamically (only as much lines as there are Cues in the CueList are created and shown), it is important that you sync the session, save it and reload it every time you change the QLab Project (Workspace); and also when a new QLab-OSC module is inserted for the first time in a Chataigne-Session !   
Shortcuts are cmd-S for Save and cmd-shift-O for Reload !

You can deactivate "Permanent-Feedback" if you want so. In this case you will still get Feedback after sending actions and commands to QLab; but changes on QLab itself will not more be reflected in a permanent continuous way in Chataigne !

### Actual Version is 1.3
I will add some more features in the future?

There is already a QLab Module integrated in Chataigne (under the Software-Menu), but without Feedback-Features ! If you don't need Feedback, use the Basic-Module instead. It'll be easier to work with!

Please contact me if you have any suggestions, demands or requests and any help is always welcome !!   
Have Fun ...  

To learn more about Chataigne, please visit : http://benjamin.kuperberg.fr/chataigne/    
And Ben's Youtube channel where you can find tutorials : https://youtu.be/RSBU9MwJNLY
