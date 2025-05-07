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
  get "/profiles/me", to: "profiles#show_me"
  patch "/profiles/me", to: "profiles#update", as: "update_profile"
  delete "/profiles/me", to: "profiles#destroy", as: "destroy_profile"

end
