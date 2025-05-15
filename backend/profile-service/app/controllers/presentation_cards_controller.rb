class PresentationCardsController < ApplicationController
  before_action :set_profile_id, only: %i[index create update destroy]
  before_action :set_presentation_card, only: %i[show update destroy]
  before_action :authorized_to_edit?, only: %i[update destroy]

  # GET /profiles/me/presentation_cards
  def index
    @presentation_cards = PresentationCard.where(profile_id: @profile_id)

    render json: @presentation_cards.map { |card| { id: card.id, name: card.name, content: card.content } }
  end

  # GET /profiles/presentation_cards/1
  def show
    if @presentation_card
      render json: @presentation_card, status: :ok
    else
      render json: { error: 'Unable to fetch presentation card' }, status: :unprocessable_entity
    end
  end

  # POST /profiles/me/presentation_cards
  def create
    @presentation_card = PresentationCard.new(presentation_card_params.merge(profile_id: @profile_id))

    if @presentation_card.save
      render json: @presentation_card, status: :created, location: @presentation_card
    else
      render json: @presentation_card.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /profiles/me/presentation_cards/1
  def update
    if @presentation_card.update(presentation_card_params)
      render json: @presentation_card
    else
      render json: @presentation_card.errors, status: :unprocessable_entity
    end
  end

  # DELETE /profiles/me/presentation_cards/1
  def destroy
    @presentation_card.destroy!
    render json: { message: 'Presentation Card successfully deleted' }, status: :ok
  rescue ActiveRecord::RecordNotDestroyed
    render json: { error: 'Failed to delete Presentation Card' }, status: :unprocessable_entity
  end

  private
  def set_profile_id
    @profile_id = request.headers["X-Profile-ID"]
    Rails.logger.debug { "Profile ID: #{@profile_id}" }
    render json: { error: 'Profile ID is missing' }, status: :bad_request unless @profile_id
    render json: { error: 'Profile not found' }, status: :unprocessable_entity unless Profile.exists?(id: @profile_id)
  end

    def set_presentation_card
      @presentation_card = PresentationCard.find_by(id: params[:id])
      if @presentation_card.nil?
        render json: { error: 'Presentation Card not found' }, status: :not_found
        return
      end
    end

    def presentation_card_params
      params.require(:presentation_card).permit(:name, :content)
    end

    def authorized_to_edit?
      unless ActiveSupport::SecurityUtils.secure_compare(@presentation_card.profile_id.to_s, @profile_id.to_s)
        render json: { error: 'Unauthorized' }, status: :unauthorized
      end
    end
end
