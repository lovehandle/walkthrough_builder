class TutorialsController < ApplicationController

  def new
    @tutorial = Tutorial.new
  end

end
