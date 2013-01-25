class LocatorController < ApplicationController
  def index
  end
  def index2
    render :partial => 'locator', :layout => false
  end
end
