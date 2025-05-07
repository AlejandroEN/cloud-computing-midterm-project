Rails.application.routes.draw do
  scope '/profiles/me' do
    resources :bookmarks, only: [:index, :create]
    delete "/bookmarks", to: "bookmarks#destroy", as: "destroy_bookmark"

    resources :presentation_cards
  end

  resources :profiles, only: [:show, :create]
  get "/profiles/me", to: "profiles#show_me"
  patch "/profiles/me", to: "profiles#update", as: "update_profile"
  delete "/profiles/me", to: "profiles#destroy", as: "destroy_profile"

  resources :institutions, only: [:index, :show, :create, :update, :destroy]
  get "/profiles/me/institutions", to: "institutions#show_own_institution"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check


end
