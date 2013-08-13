class ProxyController < ApplicationController

  respond_to :html

  before_filter :get_response, only: [ :get ]

  def get
    render text: @response.to_s, layout: false
  end

  private

  def get_response
    @response = Proxy::Client.get(params[:url])
  end

end
