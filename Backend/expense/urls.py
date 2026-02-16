from django.urls import path
from . import views

urlpatterns = [
    path('signup/',views.signup,name='signup'),
    path('login/',views.login,name='login'),
    path('add_expense/',views.add_expense,name='add_expense'),
    path('manage_expense/<int:user_id>/',views.manage_expense,name='manage_expense'),
    path('update_expense/<int:expense_id>/',views.update_expense,name='update_expense'),
    path('delete_expense/<int:expense_id>/',views.delete_expense,name='delete_expense'),
    path('search_expense/<int:user_id>/',views.search_expense,name='search_expense'),
    path('change_password/<int:user_id>/',views.change_password,name='change_password'),
    path('salary/<int:user_id>/',views.salary,name='salary'),
    path('update_salary/<int:user_id>/',views.update_salary,name='update_salary'),
    path('savings/<int:user_id>/',views.savings,name='savings'),
]