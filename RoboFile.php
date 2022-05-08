<?php
/**
 * @package     Joomla.Internal-Documentation
 *
 * @copyright   Copyright (C) 2022 Open Source Matters, Inc. All rights reserved.
 * @license     GNU General Public License version 2 or later; see LICENSE.txt
 */

use Robo\Symfony\ConsoleIO;
use Robo\Tasks;

require_once 'vendor/autoload.php';

/**
 * Modern php task runner for Joomla! Browser Automated Tests execution
 *
 * @package  RoboFile
 *
 * @since    1.0
 */
class RoboFile extends Tasks
{
	protected $config;

	public function buildApidocu(ConsoleIO $io, $opts = ['fw' => '2'])
	{
		$this->reposCheckout($io, $opts);
		$this->generatePhpdocu($io, $opts);
	}

	public function reposCheckout(ConsoleIO $io, $opts = ['fw' => '2'])
	{
		$this->say('Checking out correct version of the framework repos');

		if (!$this->config)
		{
			$this->config = \Symfony\Component\Yaml\Yaml::parseFile(__DIR__ . '/packages.yml');
		}

		$taglessDirectories = [
			'datetime',
			'mediawiki-api',
			'renderer',
			'symfony-event-dispatcher-bridge'
		];

		foreach ($this->config['packages'] as $name => $package)
		{
			if (is_null($package) || (is_array($package) && !(isset($package['deprecated']) || isset($package['abandoned']))))
			{
				$repo = $name;

				if (isset($package['repo']))
				{
					$repo = $package['repo'];
				}

				$this->say('Repository: ' . $name . ' (' . $repo . ')');

				if (!is_dir(__DIR__ . '/repos/' . $name))
				{
					$this->say('Clone repo');
					system('git clone https://github.com/joomla-framework/' . $repo . '.git ./repos/' . $name);
				}

				chdir(__DIR__ . '/repos/' . $name);
				$tag = system('git tag -l "' . $opts['fw'] . '.*"');
				system("git checkout tags/$tag");

				chdir(__DIR__ . '/');
			}
		}

		$this->say('Repos have been checked out.');
	}

	public function generatePhpdocu(ConsoleIO $io, $opts = ['fw' => '2'])
	{
		$this->say('Generate API documentation using phpDocumentor for Joomla Framework ' . $opts['fw'] . '.x packages');
		$this->_exec('php phpDocumentor.phar -d ./repos/*/src -t ./build/api-docs/v' . $opts['fw'] . '/ --template ./ --title "Joomla! Framework ' . $opts['fw'] . '.x API" -i ./repos/string/src/phputf8');
	}
}
