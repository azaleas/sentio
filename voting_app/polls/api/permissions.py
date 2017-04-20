from rest_framework.permissions import BasePermission

class IsAuthenticatedCustom(BasePermission):
    def has_permission(self, request, view):
        if view.action == 'list' or view.action == 'retrieve':
            return True
        else:
            if request.user.is_authenticated():
                return True
            return False