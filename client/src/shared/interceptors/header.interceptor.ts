import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const headerInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req.clone({
        setHeaders: {
            'X-Riffly-Client-Type': environment.clientType,
            'X-Riffly-Version': environment.version
        }
    }));
};
