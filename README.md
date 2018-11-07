This is a quick start guide for using the Evil Brisket "hat" with your RaspberryPi. If you would like to <a href="https://evilbrisket.com/products/evil-brisket-bbq-board-for-raspberrypi?variant=9098018324524">purchase</a> a board and/or enclosure, please stop by our <a href="https://www.evilbrisket.com">online shop<a>. 

## Hardware

1. If you're RaspberryPi is already running, shut it down and remove the power source. 

2. Install the Evil Brisket board on top of your Pi, ensuring there is a snug fit on the 40-pin GPIO header. At this point _do not_ install any standoffs; it's best to ensure everything is working before mounting your Pi and the Evil Brisket into its enclosure. 

3. Install the required software on your RaspberryPi (see below) and verify everything is working.

4. Power down your Pi, remove the power source and carefully seprate the Evil Brisket board from the Pi. 

4. Unwrap the enclosure. It comes in two parts that snap together, however, they were not designed to joined together more than a few times before breaking, so do not install the lid more than once.

5. Place your RaspberryPi over the bosses (white plastic uprights) in the lower half of the enclosure

6. Screw the four standoffs in place, which should effectively hold down the Pi into the enclosure.

7. Reinstall the Evil Brisket board, again making sure there's a solid connection on the GPIO header.

8. Use the four small screws to secure the top of the Evil Brisket board to the standoffs.

10. Carefully position the enclosure lid over the bottom assembly and snap into place. You're Evil Brisket should be ready to use at this point! Keep in mind that the enclosure is not weather proof and should be kept dry.


## Required Software for your Pi

1. Plug in and boot your Pi. 

2. Ensure your Pi connected to WiFi and can reach the Internet. If you need to setup WiFi on your Pi, <a href="https://learn.adafruit.com/adafruits-raspberry-pi-lesson-3-network-setup/setting-up-wifi-with-occidentalis">these directions are pretty good</a>, especially if you do not have a monitor or keyboard attached to your Pi. 

3. Find your Pi's IP address. The easiest way to do this is to login to your WiFi router's admin console and search for _raspberrypi_ amongst the connected clients listing. 

4. Login to your Pi using SSH or from the graphical interface if you have it available.

5. From a terminal, install Node.js

		curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -

		sudo apt-get install -y nodejs
	
6. Install the bcm2835 library

		wget http://www.airspayce.com/mikem/bcm2835/bcm2835-1.57.tar.gz

		tar xvf bcm2835-1.57.tar.gz 

		cd bcm2835-1.57

		./configure

		sudo make install

7. Install git (if needed)

		sudo apt-get install git

8. Install the Evil Brisket software (finally!)

		cd	
	
		git clone https://github.com/evilbrisket/evilbrisket-service.git

		cd evilbrisket-service

		npm install

9. Manually test the Evil Brisket software, by running the following command:

		sudo node evilbrisket.js 

	Then plug-in at least one temperature probe and launch the Evil Brisket iPhone app (see below). After a few moments the blue light on the board should light up indicating your phone has connected. You should also see one temperature reading on the screen. You're all set! Stop the Evil Brisket software by typing Control-C.
	
10. Setup the Evil Brisket software so it starts automatically whenever you reboot your RaspberryPi. This will ensure it's always running when you're ready to barbeque.

		cd scripts

		sudo npm -g install forever

		sudo cp EvilBrisketService /etc/init.d/
	
		sudo chmod 755 /etc/init.d/EvilBrisketService

		sudo update-rc.d EvilBrisketService defaults

11. Reboot your RaspberryPi and/or continue with installing your EvilBrisket board and Pi into the enclosure. Happy grilling!

## Evil Brisket iPhone Application

Download <a href="https://itunes.apple.com/us/app/evil-brisket/id1362669008?mt=8">Evil Brisket for iOS</a>.

Our iPhone app will connect to the Evil Brisket board through Bluetooth Low Energy to report temperatures locally. Additionally, the board software (through your RaspberryPi's WiFi connection) uploads temperatures to our cloud service every few seconds. If you're using our app and are not withing BLE range (which is only a few feet), the app will still receive temperatures using your phone's WiFi or cellular connection.
