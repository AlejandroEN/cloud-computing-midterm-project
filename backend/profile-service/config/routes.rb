Rails.application.routes.draw do
  scope '/profiles/me' do
    resources :bookmarks, only: [:index, :create]
    delete "/bookmarks", to: "bookmarks#destroy", as: "destroy_bookmark"

    resources :presentation_cards, except: [:show]
  end

  resources :profiles, only: [:show, :create]
  get "/profiles/me", to: "profiles#show_me"
  get "/profiles", to: "profiles#show_by_email", as: "show_by_email"
  patch "/profiles/me", to: "profiles#update", as: "update_profile"
  patch "/profiles/:id", to: "profiles#update_stars", as: "update_stars"
  delete "/profiles/me", to: "profiles#destroy", as: "destroy_profile"
  get "/profiles/presentation_cards/:id", to: "presentation_cards#show"

  resources :institutions, only: [:index, :show, :create, :update, :destroy]
  get "/profiles/me/institutions", to: "institutions#show_own_institution"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check


end
