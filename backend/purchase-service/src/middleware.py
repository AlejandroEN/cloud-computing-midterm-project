from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

class ValidateHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint):
        x_profile_id = request.headers.get("X-Profile-ID")
        x_institution_id = request.headers.get("X-Institution-ID")

        if not x_profile_id or not x_institution_id:
            raise HTTPException(
                status_code=400,
                detail="Missing required headers: X-Profile-ID or X-Institution-ID"
            )

        request.state.x_profile_id = x_profile_id
        request.state.x_institution_id = x_institution_id

        response = await call_next(request)
        return response
