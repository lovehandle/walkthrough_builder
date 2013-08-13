Thorn Shared-Hash Application
=============================

Ruby Installation
-----------------

Clone RbPhotoDNA from GitHub to your machine:

  $ git clone git@github.com:wearethorn/rbphotodna.git

(Assuming you are using Bundler) include the gem in your Gemfile:

  gem 'rbphotodna', path: '/PATH_TO_CLONED_REPO'

Install gem dependencies:

  $ bundle install

Clone CPClassifier Server from GitHub to your machine:

  $ git clone git@github.com:wearethorn/cpclassifier.git

Install the CPClassifier Python module:

  $ cd cpclassifier
  $ sudo python setup.py install

Start the CPClassifier Server:

  $ ./run.sh

Clone CPClassifier Client from GitHub to your machine:

  $ git clone git@github.com:wearethorn/cpcclient.git

(Assuming you are using Bundler) include the gem in your Gemfile:

  gem 'cpclassifier', path: '/PATH_TO_CLONED_REPO/ruby'

Install gem dependencies:

  $ bundle install

Run the tests:

  $ cd cpcclient/ruby
  $ rspec .
