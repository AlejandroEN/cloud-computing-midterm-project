Rails.application.routes.draw do
  resources :presentation_cards
  resources :bookmarks
  resources :profiles, only: [:show, :create]
  resources :institutions
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  get "/profiles/self", to: "profiles#show_self"
  patch "/profiles/self", to: "profiles#update", as: "update_profile"
  delete "/profiles/self", to: "profiles#destroy", as: "destroy_profile"

end
