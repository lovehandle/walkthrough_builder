Walkthrough::Application.routes.draw do

  resources :tutorials

  StaticPagesController::PAGES.each do |page|
    get "/#{page}", to: "static_pages##{page}", as: "#{page}"
  end

  get "/proxy", to: "proxy#get", as: :proxy_get

end
