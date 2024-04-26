import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem("token");

    if (token) {
        const cloned = req.clone({
            headers: req.headers.set("Authorization",
                "Bearer " + token)
        });

        return next.handle(cloned);
    }
    else {
        return next.handle(req);
    }
}
    
  }


/*
✔✔💖💖
Assurez-vous d'injecter HttpClientModule dans votre module racine 
(AppModule) ou dans un module où vous utilisez les services HTTP.
----L'intercepteur sera maintenant automatiquement utilisé pour toutes
 les requêtes HTTP sortantes dans votre application Angular. -----
 Vous n'avez pas besoin de faire quoi que ce soit de plus dans vos services ou composants pour l'utiliser.

*/