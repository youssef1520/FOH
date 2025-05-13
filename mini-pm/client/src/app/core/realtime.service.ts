 import { Injectable, signal }          from '@angular/core';
 import Echo                             from 'laravel-echo';
 import Pusher                           from 'pusher-js';
 import { environment }                  from '../../environments/environment';
 
 type EchoClient = Echo<any>;
  (window as any).Pusher = Pusher;
 
 @Injectable({ providedIn: 'root' })
 export class RealtimeService {
   private _ready = signal(false);
   get   ready()   { return this._ready(); }
 
   private echo?: EchoClient;
 
   /* 
    |  Connect – call **once** after the user is authenticated
   */
   connect(bearerToken: string) {
     if (this.echo) return;
 
     this.echo = new Echo<any>({
       broadcaster : 'pusher',
       key         : environment.pusher.key,
       wsHost      : environment.pusher.host,
       wsPort      : environment.pusher.port,
       wssPort     : environment.pusher.port,
       forceTLS    : environment.pusher.forceTLS,
       cluster     : environment.pusher.cluster,
       disableStats: true,
 
       authEndpoint: `${environment.apiUrl}/broadcasting/auth`,
       auth: {
         headers: {
           Authorization: `Bearer ${bearerToken}`
         }
       }
     }) as unknown as EchoClient;
 
     this.echo.connector.pusher.connection.bind('connected', () => {
       this._ready.set(true);
       console.info('[Echo] ✅ connected');
     });
   }
 
   /* 
      Disconnect – call on logout
    */
   disconnect() {
     this.echo?.disconnect();
     this.echo = undefined;
     this._ready.set(false);
   }
 
   /* 
     helper: subscribe to TaskUpdated from global “task” channel
    */
   onTaskUpdated(cb: (payload: any) => void) {
     this.echo?.channel('task').listen('TaskUpdated', cb);
   }
 } 